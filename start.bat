@echo off
title Melomix - Music Recommender
echo ========================================================
echo   Melomix - მუსიკების შემომთავაზებელი & ამრჩევი
echo ========================================================
echo სერვერი ირთვება...
echo ბრაუზერი ავტომატურად იხსნება მისამართზე: http://localhost:8000
echo.
start http://localhost:8000
python -m http.server 8000
pause

