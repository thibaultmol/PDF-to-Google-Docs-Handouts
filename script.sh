#!/usr/bin/env bash
mkdir Slides

run_install()
{
    ## Prompt the user 
    read -p "Do you want to install missing libraries? [Y/n]: " answer
    ## Set the default value if no answer was given
    answer=${answer:Y}
    ## If the answer matches y or Y, install
    [[ $answer =~ [Yy] ]] && apt-get install ${boostlibnames[@]}
}
boostlibnames=("imagemagick" "tesseract-ocr" "tesseract-ocr-nld" "tesseract-ocr-fra" "tesseract-ocr-eng")
## Run the run_install function if sany of the libraries are missing
dpkg -s "${boostlibnames[@]}" >/dev/null 2>&1 || run_install

## if [ $(dpkg-query -W -f='${Status}' imagemack 2>/dev/null | grep -c "ok installed") -eq 0 ];
## then
##   apt-get install imagemagick;
## fi
echo "convert -verbose -density 300 etixx.pdf -quality 100 -flatten Slides/etixx-%03d.jpg"
convert -verbose -density 260.8 Slides.pdf -quality 100 -depth 8 Slides/Slides-%03d.jpg
convert Slides/*.jpg toOCR.pdf
mogrify -quality 93 -resize 'x489' -bordercolor Black -border 2x2 Slides/*.jpg
