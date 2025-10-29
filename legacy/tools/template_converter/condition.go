package main

import (
	"bufio"
	"bytes"
	"errors"
	"io"
	"regexp"
)

// type TokenType int

// const (
// 	TokenTypeIdentifier TokenType = iota
// 	TokenTypeOperator
// 	TokenTypeLiteral
// 	TokenTypePunctuation
// 	TokenTypeKeyword
// )

// type Token interface {
// 	Type() TokenType
// 	Value() string
// }

// type OperatorKind string

// const (
// 	OperatorKindPlus     OperatorKind = "+"
// 	OperatorKindMinus    OperatorKind = "-"
// 	OperatorKindMultiply OperatorKind = "*"
// 	OperatorKindDivide   OperatorKind = "/"
// 	OperatorKindEqual    OperatorKind = "="
// 	OperatorKindNotEqual OperatorKind = "!="
// 	OperatorKindAnd      OperatorKind = "and"
// 	OperatorKindOr       OperatorKind = "or"
// )

// type TokenOperator struct {
// 	kind  OperatorKind
// 	value Token
// }

// func (t *TokenOperator) Type() TokenType {
// 	return TokenTypeOperator
// }

// func (t *TokenOperator) Value() string {
// 	return string(t.kind)
// }

// type TokenGroup struct {
// 	tokens []TokenOperator
// }

// func (t *TokenGroup) Type() TokenType {
// 	return TokenTypePunctuation
// }

// type ConditionParser struct {
// 	token Token
// }

// func (p *ConditionParser) ParseCondition(r *bufio.Reader) ([]byte, error) {

// }

func convertCondition(cond []byte) ([]byte, error) {
	r, _ := regexp.Compile("([^=^!])=([^=])")
	return r.ReplaceAll(cond, []byte("$1==$2")), nil
}

func ParseCondition(r *bufio.Reader) ([]byte, error) {
	var buf bytes.Buffer

	shortIf := false
	{
		b, err := r.Peek(1)
		if err != nil {
			return nil, err
		}
		if b[0] == '(' {
			shortIf = false
		} else {
			shortIf = true
		}
	}

	if shortIf {
		cond, err := r.ReadBytes(';')
		if err != nil {
			return nil, err
		}
		return cond[:len(cond)-1], nil
	}

	depth := 1
	{
		buf, err := r.ReadBytes('(')
		if err != nil {
			if errors.Is(err, io.EOF) {
				return buf, err
			}
		}
	}
	buf.WriteByte('(')
	for {
		b, err := r.ReadByte()
		buf.WriteByte(b)
		if err != nil {
			if errors.Is(err, io.EOF) {
				return buf.Bytes(), err
			}
			return nil, err
		}
		if b == '(' {
			depth++
		} else if b == ')' {
			depth--
			if depth == 0 {
				break
			}
		}
	}
	return convertCondition(buf.Bytes())
}
