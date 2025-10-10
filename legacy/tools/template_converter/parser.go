package main

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"io"
	"slices"
	"strings"

	"github.com/emirpasic/gods/v2/stacks/arraystack"
)

type JinJaParser struct {
	JinJaTemplate
	Errors        *arraystack.Stack[error]
	Stack         *arraystack.Stack[string]
	tokenHandlers map[string]TokenFunc
}

func NewJinJaParser(template JinJaTemplate) *JinJaParser {
	return &JinJaParser{
		JinJaTemplate: template,
		Errors:        arraystack.New[error](),
		Stack:         arraystack.New[string](),
		tokenHandlers: tokenHandlers,
	}
}

func ReadUntilAny(r io.ByteReader, delims ...byte) ([]byte, error) {
	var buf bytes.Buffer
	for {
		b, err := r.ReadByte()
		if err != nil {
			return buf.Bytes(), err
		}
		buf.WriteByte(b)
		for _, d := range delims {
			if b == d {
				return buf.Bytes(), nil
			}
		}
	}
}

func ReadLine(r *bufio.Reader) ([]byte, error) {
	return ReadUntilAny(r, ';', '\n')
}

func (p *JinJaParser) ShowStack() {
	fmt.Printf("Parser stack for template %s:\n", p.Name)
	stack := make([]string, 0, p.Stack.Size())
	it := p.Stack.Iterator()
	for it.Next() {
		stack = append(stack, it.Value())
	}
	slices.Reverse(stack)
	for i, v := range stack {
		fmt.Printf("%d: %s\n", i, v)
	}
}

func (p *JinJaParser) biggestToken() int {
	max := 0
	for k := range p.tokenHandlers {
		if len(k) > max {
			max = len(k)
		}
	}
	return max + 1
}

func (p *JinJaParser) ParseToken(r *bufio.Reader) error {
	defer p.S("ParseToken")()

	var buf bytes.Buffer

	for big := p.biggestToken(); big > 0; big-- {
		b, err := r.Peek(big)
		if errors.Is(err, io.EOF) {
			continue
		}
		if err != nil {
			return err
		}
		buf.Write(b)
		break
	}

	var (
		b   byte
		err error
	)

	b, err = buf.ReadByte()
	if err != nil {
		fmt.Printf("Error reading token: %v\n", err)
		return err
	}
	switch b {
	case '(':
		return p.HandleComment(r)
	}

	token, err := ReadUntilAny(&buf, ';', '\n')
	if err != nil && !errors.Is(err, io.EOF) {
		return err
	}

	token = append([]byte{b}, token...)

	token = bytes.TrimSuffix(token, []byte{';'})

	return p.HandleToken(token, r)
}

func (p *JinJaParser) HandleToken(token []byte, r *bufio.Reader) error {
	defer p.S("HandleToken")()

	key := strings.TrimSpace(string(token))

	if handler, ok := p.tokenHandlers[key]; ok {
		r.Discard(len(token) + 1)
		return handler(p, key, r)
	}

	return p.HandleVar(string(token), r)
}

func (p *JinJaParser) ForwardEnd(expected error, r *bufio.Reader) error {
	defer p.S("fend")()
	err := p.ParseR(r)
	if err != expected {
		fmt.Printf("failed to parse template %s: %v\n", p.Name, err)
		if err == nil {
			err = ErrMissingEnd
		}
		return err
	}
	return nil
}

func (p *JinJaParser) EOF(buf []byte, err error) error {
	if errors.Is(err, io.EOF) {
		p.Data.Write(buf)
	}
	return err
}

func (p *JinJaParser) FastForward(r *bufio.Reader) error {
	defer p.S("ff")()
	buf, err := r.ReadBytes('%')
	if p.EOF(buf, err) != nil {
		return err
	}
	p.Data.Write(buf[:len(buf)-1])
	return p.ParseToken(r)
}

func (p *JinJaParser) ParseR(r *bufio.Reader) error {
	defer p.S("parse")()
	for {
		if err := p.FastForward(r); err != nil {
			return err
		}
	}
}

func (p *JinJaParser) Parse(r *bufio.Reader) (JinJaTemplate, error) {
	err := p.ParseR(r)
	if errors.Is(err, io.EOF) {
		return p.JinJaTemplate, nil
	}
	if err != nil {
		return JinJaTemplate{}, err
	} else {
		return JinJaTemplate{}, errors.New("unreachable")
	}
}
