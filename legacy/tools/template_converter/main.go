package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"slices"
	"strings"
	"text/template"
	"time"

	flag "github.com/spf13/pflag"
)

var FileExtension = []string{".txt"}

type JinJaTemplate struct {
	Name      string
	Data      *bytes.Buffer
	Vars      map[string]struct{}
	Functions map[string]struct{}
	Imports   map[string]struct{}
}

type GenewebTemplate struct {
	Name string
	Data []byte
}

var outputDir = flag.StringP("out", "o", "./out/", "Directory to output converted templates")
var inputDir = flag.StringP("in", "i", "", "Directory to read templates to convert")
var onlyConvert = flag.StringSliceP("only", "c", nil, "Only convert specified templates (by name, without extension)")
var recursive = flag.BoolP("recursive", "r", false, "Recursively search for templates in input directory")

func init() {
	flag.Parse()
	if *inputDir == "" {
		fmt.Println("input_dir is required")
		flag.Usage()
		os.Exit(1)
	}

	if _, err := os.Stat(*inputDir); os.IsNotExist(err) {
		fmt.Printf("input_dir %s does not exist\n", *inputDir)
		os.Exit(1)
	}

	if _, err := os.Stat(*outputDir); os.IsNotExist(err) {
		err := os.MkdirAll(*outputDir, os.ModePerm)
		if err != nil {
			fmt.Printf("failed to create output_dir %s: %v\n", *outputDir, err)
			os.Exit(1)
		}
	}

	if onlyConvert != nil && len(*onlyConvert) == 0 {
		onlyConvert = nil
	}
}

func GetTemplates(basedir, dir string) ([]GenewebTemplate, error) {
	templates := []GenewebTemplate{}

	templatePath := path.Join(basedir, dir)

	files, err := os.ReadDir(templatePath)
	if err != nil {
		fmt.Printf("failed to read input_dir %s: %v\n", *inputDir, err)
		os.Exit(1)
	}

	for _, file := range files {
		if file.IsDir() {
			if !*recursive {
				continue
			}
			dirTemplates, err := GetTemplates(basedir, path.Join(dir, file.Name()))
			if err != nil {
				return nil, err
			}
			templates = append(templates, dirTemplates...)
			continue
		}

		if !slices.Contains(FileExtension, filepath.Ext(file.Name())) {
			continue
		}

		filePath := path.Join(templatePath, file.Name())
		name, err := filepath.Rel(basedir, filePath)
		if err != nil {
			return nil, err
		}
		name = strings.TrimSuffix(name, filepath.Ext(name))

		data, err := os.ReadFile(filePath)
		if err != nil {
			fmt.Printf("failed to read file %s: %v\n", file.Name(), err)
			os.Exit(1)
		}

		template := GenewebTemplate{
			Name: name,
			Data: data,
		}

		fmt.Printf("Found template: %s\n", template.Name)

		templates = append(templates, template)
	}

	return templates, nil
}

func ConvertTemplate(t GenewebTemplate) (jt JinJaTemplate, err error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered. Error:\n", r)
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	br := bytes.NewReader(t.Data)

	r := bufio.NewReader(br)
	jt = JinJaTemplate{
		Name:      t.Name,
		Vars:      map[string]struct{}{},
		Functions: map[string]struct{}{},
		Imports:   map[string]struct{}{},
		Data:      bytes.NewBuffer(nil),
	}

	jp := NewJinJaParser(jt)

	jt, err = jp.Parse(r)
	if err != nil {
		fmt.Printf("failed to convert template %s: %v\n", t.Name, err)
		pos, err := br.Seek(0, io.SeekCurrent)
		if err != nil {
			fmt.Printf("failed to get current position in template %s: %v\n", t.Name, err)
			return jt, err
		}
		pos -= int64(r.Buffered())
		fmt.Printf("stopped at byte %d (around line %d)\n", pos, bytes.Count(t.Data[:pos], []byte{'\n'})+1)
		fmt.Printf("context:\n%s\n", t.Data[pos-64:pos+64])

		// Print the stack trace
		return jt, err
	}

	return jt, nil
}

var headerTmpl = `{# This file is auto-generated from Geneweb template on {{.Now}} #}
{# Original template: {{.Name}} #}
{# Template variables: {{.Vars}} #}
{# Template functions: {{.Functions}} #}
{# Template imports: {{.Imports}} #}
`

func main() {
	fmt.Printf("Converting templates from %s to %s\n", *inputDir, *outputDir)

	templates, err := GetTemplates(*inputDir, ".")
	if err != nil {
		fmt.Printf("failed to get templates: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Found %d templates\n", len(templates))

	header := template.New("header")

	imports := make(map[string][]string)
	vars := make(map[string][]string)

	for _, t := range templates {
		if onlyConvert != nil && !slices.Contains(*onlyConvert, t.Name) {
			continue
		}
		jt, err := ConvertTemplate(t)
		if err != nil {
			fmt.Printf("failed to convert template %s: %v\n", t.Name, err)
			continue
		}

		if jt.Data == nil {
			fmt.Printf("template %s has no data after conversion\n", t.Name)
			continue
		}

		for v := range jt.Imports {
			imports[v] = append(imports[v], t.Name)
		}

		for v := range jt.Vars {
			vars[v] = append(vars[v], t.Name)
		}

		outPath := path.Join(*outputDir, t.Name+".html.j2")
		err = os.MkdirAll(path.Dir(outPath), os.ModePerm)
		if err != nil {
			fmt.Printf("failed to create output directory for %s: %v\n", outPath, err)
			os.Exit(1)
		}
		f, err := os.Create(outPath)
		if err != nil {
			fmt.Printf("failed to create output file %s: %v\n", outPath, err)
			os.Exit(1)
		}
		defer f.Close()

		now := time.Now().Format(time.RFC3339)

		hdrData := struct {
			Now       string
			Name      string
			Vars      []string
			Functions []string
			Imports   []string
		}{
			Now:  now,
			Name: jt.Name,
		}
		for v := range jt.Vars {
			hdrData.Vars = append(hdrData.Vars, v)
		}
		for f := range jt.Functions {
			hdrData.Functions = append(hdrData.Functions, f)
		}
		for i := range jt.Imports {
			hdrData.Imports = append(hdrData.Imports, i)
		}

		slices.Sort(hdrData.Vars)
		slices.Sort(hdrData.Functions)
		slices.Sort(hdrData.Imports)

		header, err = header.Parse(headerTmpl)
		if err != nil {
			fmt.Printf("failed to parse header template: %v\n", err)
			os.Exit(1)
		}

		err = header.Execute(f, hdrData)
		if err != nil {
			fmt.Printf("failed to execute header template for %s: %v\n", outPath, err)
			os.Exit(1)
		}

		// _, err = f.Write(jt.Data.Bytes())
		_, err = io.Copy(f, jt.Data)
		if err != nil {
			fmt.Printf("failed to write output file %s: %v\n", outPath, err)
			os.Exit(1)
		}

		fmt.Printf("Converted template %s to %s\n", t.Name, outPath)
		fmt.Printf("  - found %d variables\n", len(jt.Vars))
		fmt.Printf("  - found %d functions\n", len(jt.Functions))
		fmt.Printf("  - found %d imports\n", len(jt.Imports))
	}

	fmt.Printf("Found %d unique imports\n", len(imports))
	fmt.Printf("Found %d unique variables\n", len(vars))

	fmt.Println("Imports:")
	for imp, tmpls := range imports {
		fmt.Printf("  %s: %d\n", imp, len(tmpls))
	}

	// fmt.Println("Root:")
	// for _, t := range templates {
	// 	if imports[t.Name] != nil {
	// 		continue
	// 	}
	// 	fmt.Printf("  %s\n", t.Name)
	// }

	// fmt.Println("Variables:")
	// for v, tmpls := range vars {
	// 	fmt.Printf("  %s: %v\n", v, tmpls)
	// }
}
