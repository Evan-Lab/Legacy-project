package main

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"io"
	"strings"
)

var (
	ErrEndToken     = errors.New("unexpected end of token")
	ErrMissingEnd   = errors.New("missing end for block")
	ErrEndOfIf      = errors.New("unexpected end of if block")
	ErrEndOfDefine  = errors.New("unexpected end of define block")
	ErrEndOfApply   = errors.New("unexpected end of apply block")
	ErrEndOfWith    = errors.New("unexpected end of with block")
	ErrEndOfAnd     = errors.New("unexpected end of and block")
	ErrEndOfForEach = errors.New("unexpected end of foreach block")
)

var tokenHandlers = map[string]TokenFunc{
	"include": (*JinJaParser).HandleImport,
	"end":     (*JinJaParser).HandleEnd,
	"if":      (*JinJaParser).HandleIf,
	"define":  (*JinJaParser).HandleDefine,
	"apply":   (*JinJaParser).HandleApply,
	"foreach": (*JinJaParser).HandleForEach,
}

type TokenFunc func(t *JinJaParser, token string, r *bufio.Reader) error

// func (p *JinJaParser) HandleWith(r *bufio.Reader) error {
// 	oldh, hasOld := p.tokenHandlers["with"]

// }

func (p *JinJaParser) S(name string) func() {
	p.Stack.Push(name)
	return func() {
		v, ok := p.Stack.Pop()
		if !ok || v != name {
			panic("stack corrupted")
		}
	}
}

func (p *JinJaParser) HandleForEach(token string, r *bufio.Reader) error {
	defer p.S("HandleForEach")()

	cond, err := ParseCondition(r)
	if err != nil {
		return err
	}

	p.Data.Write([]byte("{% for " + string(cond) + " %}"))

	p.Errors.Push(ErrEndOfForEach)

	if err := p.ForwardEnd(ErrEndOfForEach, r); err != nil {
		return err
	}

	p.Data.Write([]byte("{% endfor %}"))

	return nil
}

func (p *JinJaParser) HandleApply(token string, r *bufio.Reader) error {
	defer p.S("HandleApply")()
	const withDelim = "with;"

	p.Errors.Push(ErrEndOfApply)

	// return p.ForwardEnd(ErrEndOfApply, r)

	useWith := false

	fname, err := ReadUntilAny(r, '(', '%')
	if p.EOF(fname, err) != nil {
		return err
	}
	switch fname[len(fname)-1] {
	case '%':
		useWith = true
	case '(':
		useWith = false
	default:
		return fmt.Errorf("invalid apply syntax in template %s", p.Name)
	}
	fname = fname[:len(fname)-1]

	p.Functions[string(fname)] = struct{}{}

	if !useWith {
		r.UnreadByte()
		args, err := ParseCondition(r)
		if p.EOF(args, err) != nil {
			return err
		}
		p.Data.Write([]byte("{{ " + string(fname) + string(args) + " }}"))
		return p.ForwardEnd(ErrEndOfApply, r)
	}

	args := make([]*bytes.Buffer, 0)

	oldData := p.Data
	buf := bytes.NewBuffer(nil)
	p.Data = buf
	defer func() { p.Data = oldData }()

	andHandler, hasAnd := p.tokenHandlers["and"]
	defer func() {
		if hasAnd {
			p.tokenHandlers["and"] = andHandler
		} else {
			delete(p.tokenHandlers, "and")
		}
	}()

	p.tokenHandlers["and"] = func(p *JinJaParser, token string, r *bufio.Reader) error {
		args = append(args, p.Data)
		buf := bytes.NewBuffer(nil)
		p.Data = buf
		return nil
	}

	if err := p.ForwardEnd(ErrEndOfApply, r); err != nil {
		return err
	}

	oldData.Write([]byte("{{ " + string(fname) + "("))

	for i, arg := range args {
		if i > 0 {
			oldData.Write([]byte(", "))
		}
		oldData.Write(arg.Bytes())
	}

	oldData.Write([]byte(") }}"))

	return nil

}

func (p *JinJaParser) HandleDefine(token string, r *bufio.Reader) error {
	defer p.S("HandleDefine")()
	buf, err := r.ReadBytes('\n')
	if p.EOF(buf, err) != nil {
		return err
	}

	definition := strings.TrimSpace(string(buf))
	if definition == "" {
		return fmt.Errorf("empty define in template %s", p.Name)
	}

	p.Data.Write([]byte("{% macro " + definition + " %}\n"))

	p.Errors.Push(ErrEndOfDefine)

	if err := p.ForwardEnd(ErrEndOfDefine, r); err != nil {
		return err
	}

	p.Data.Write([]byte("{% endmacro %}\n"))

	return nil
}

func (p *JinJaParser) HandleImport(token string, r *bufio.Reader) error {
	defer p.S("HandleImport")()
	buf, err := r.ReadBytes('\n')
	if p.EOF(buf, err) != nil {
		return err
	}

	fmtd := strings.TrimSpace(string(buf))
	if fmtd == "" {
		return fmt.Errorf("empty import in template %s", p.Name)
	}

	fmtd = strings.Trim(fmtd, "\"'")
	if fmtd == "" {
		return fmt.Errorf("empty import in template %s", p.Name)
	}

	// p.Imports = append(p.Imports, fmtd)
	p.Imports[fmtd] = struct{}{}

	p.Data.Write([]byte("{% include '" + fmtd + ".html.j2' %}\n"))

	return nil
}

func (p *JinJaParser) HandleComment(r *bufio.Reader) error {
	defer p.S("HandleComment")()
	var (
		buf     []byte
		err     error
		comment []byte
	)
	for {
		buf, err = r.ReadBytes('%')
		if p.EOF(buf, err) != nil {
			return err
		}
		comment = append(comment, buf[:len(buf)-1]...)
		b, err := r.ReadByte()
		if p.EOF([]byte{b}, err) != nil {
			return err
		}
		if b == ')' {
			break
		}
		comment = append(comment, []byte{'%', b}...)
	}

	jinjaComment := "{#" + string(comment) + "#}"
	p.Data.Write([]byte(jinjaComment))
	return nil
}

func (p *JinJaParser) HandleIf(token string, r *bufio.Reader) error {
	defer p.S("HandleIf")()

	cond, err := ParseCondition(r)
	if p.EOF(cond, err) != nil {
		return err
	}

	p.Data.Write([]byte("{% if " + string(cond) + " %}"))

	p.Errors.Push(ErrEndOfIf)

	oldElseHandler, hasElse := p.tokenHandlers["else"]
	defer func() {
		if hasElse {
			p.tokenHandlers["else"] = oldElseHandler
		} else {
			delete(p.tokenHandlers, "else")
		}
	}()

	p.tokenHandlers["else"] = func(p *JinJaParser, token string, r *bufio.Reader) error {
		p.Data.Write([]byte("{% else %}"))
		return nil
	}

	oldElseIfHandler, hasElseIf := p.tokenHandlers["elseif"]
	defer func() {
		if hasElseIf {
			p.tokenHandlers["elseif"] = oldElseIfHandler
		} else {
			delete(p.tokenHandlers, "elseif")
		}
	}()

	p.tokenHandlers["elseif"] = func(p *JinJaParser, token string, r *bufio.Reader) error {
		cond, err := ParseCondition(r)
		if p.EOF(cond, err) != nil {
			return err
		}
		p.Data.Write([]byte("{% elseif " + string(cond) + " %}"))
		return nil
	}

	if err := p.ForwardEnd(ErrEndOfIf, r); err != nil {
		return err
	}

	p.Data.Write([]byte("{% endif %}"))

	return nil
}

func (p *JinJaParser) HandleVar(token string, r *bufio.Reader) error {
	defer p.S("HandleVar")()

	buf := bytes.Buffer{}

	for {
		b, err := r.ReadByte()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			return err
		}
		if (b >= 'a' && b <= 'z') ||
			(b >= 'A' && b <= 'Z') ||
			(buf.Len() > 0 && b >= '0' && b <= '9') ||
			b == '_' ||
			(buf.Len() > 0 && b == '.') {
			buf.WriteByte(b)
			continue
		}
		if b != ';' {
			r.UnreadByte()
		}
		break
	}

	token = strings.TrimSpace(buf.String())

	// for i, c := range t {
	// 	if (c >= 'a' && c <= 'z') ||
	// 		(c >= 'A' && c <= 'Z') ||
	// 		(i > 0 && c >= '0' && c <= '9') ||
	// 		c == '_' ||
	// 		(i > 0 && c == '.') {
	// 		buf.WriteByte(c)
	// 		continue
	// 	}
	// 	break
	// }

	p.Data.Write([]byte("{{ " + token + " }}"))

	p.Vars[token] = struct{}{}

	return nil
}

func (p *JinJaParser) HandleEnd(token string, r *bufio.Reader) error {
	defer p.S("HandleEnd")()
	if p.Errors.Empty() {
		p.ShowStack()
		return ErrEndToken
	}

	v, ok := p.Errors.Pop()
	if !ok {
		p.ShowStack()
		return ErrEndToken
	}

	return v
}
