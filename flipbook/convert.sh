#!/bin/bash
echo -n "" > convert_inkscape_commands
for file in out/*.svg; do
    filename=$(basename "$file")
    echo "$file" --export-pdf="pdf/${filename%.svg}.pdf" >> convert_inkscape_commands
done
inkscape --shell < convert_inkscape_commands
# rm convert_inkscape_commands
