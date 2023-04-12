# Based upon https://github.com/thecodechef/pygments-style-extras/blob/master/styles/github.py
from pygments.style import Style
from pygments.token import Comment, Error, Number, Generic, Keyword, Literal, Name, Operator, Text

class UGentStyle(Style):
    default_style = ''

    background_color = "#FFFFFF"

    styles = {
        Comment.Multiline:              "italic #8BBEE8",
        Comment.Preproc:                "bold #8BBEE8",
        Comment.Single:                 "italic #8BBEE8",
        Comment.Special:                "bold italic #8BBEE8",
        Comment:                        "italic #8BBEE8",
        Error:                          "#000000",
        Generic:                        "#000000",
        Generic.Deleted:                "#000000",
        Generic.Emph:                   "#000000",
        Generic.Error:                  "#000000",
        Generic.Heading:                "#000000",
        Generic.Inserted:               "#000000",
        Generic.Output:                 "#000000",
        Generic.Prompt:                 "#000000",
        Generic.Strong:                 "bold",
        Generic.Subheading:             "#000000",
        Generic.Traceback:              "#000000",
        Keyword.Constant:               "bold #DC4E28 ",
        Keyword.Declaration:            "bold #DC4E28",
        Keyword.Namespace:              "bold #DC4E28",
        Keyword.Pseudo:                 "bold #DC4E28",
        Keyword.Reserved:               "bold #DC4E28",
        Keyword.Type:                   "bold #DC4E28",
        Keyword:                        "bold #DC4E28",
        Number:           "#1E64C8",
        Literal.Number.Float:           "#1E64C8",
        Literal.Number.Hex:             "#1E64C8",
        Literal.Number.Integer.Long:    "#1E64C8",
        Literal.Number.Integer:         "#1E64C8",
        Literal.Number.Oct:             "#1E64C8",
        Literal.Number:                 "#1E64C8",
        Literal.String.Backtick:        "#71A860",
        Literal.String.Char:            "#71A860",
        Literal.String.Doc:             "#71A860",
        Literal.String.Double:          "#71A860",
        Literal.String.Escape:          "#71A860",
        Literal.String.Heredoc:         "#71A860",
        Literal.String.Interpol:        "#71A860",
        Literal.String.Other:           "#71A860",
        Literal.String.Regex:           "#71A860",
        Literal.String.Single:          "#71A860",
        Literal.String.Symbol:          "#71A860",
        Literal.String:                 "#71A860",
        Name.Attribute:                 "#1E64C8",
        Name.Builtin.Pseudo:            "#1E64C8",
        Name.Builtin:                   "#1E64C8",
        Name.Class:                     "bold #1E64C8",
        Name.Constant:                  "#1E64C8",
        Name.Decorator:                 "bold #1E64C8",
        Name.Entity:                    "#1E64C8",
        Name.Exception:                 "bold #1E64C8",
        Name.Function:                  "bold #1E64C8",
        Name.Label:                     "bold #1E64C8",
        Name.Namespace:                 "#1E64C8",
        Name.Tag:                       "#1E64C8",
        Name.Variable.Class:            "#1E64C8",
        Name.Variable.Global:           "#1E64C8",
        Name.Variable.Instance:         "#1E64C8",
        Name.Variable:                  "#1E64C8",
        Operator.Word:                  "bold #DC4E28",
        Operator:                       "bold #DC4E28",
        Text.Whitespace:                "#bbbbbb",
    }