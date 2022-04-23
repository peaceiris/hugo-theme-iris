#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

mkdir -p ./static/output/chtml/fonts/woff-v2
cd ./static/output/chtml/fonts/woff-v2
rm *.woff 2>/dev/null || true
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_AMS-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Bold.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Bold.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Main-Bold.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Main-Italic.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Main-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Math-BoldItalic.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Math-Italic.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Math-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Bold.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Italic.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Script-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Size1-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Size2-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Size3-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Size4-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Typewriter-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Bold.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Regular.woff
wget --quiet --timestamping https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/output/chtml/fonts/woff-v2/MathJax_Zero.woff
