library(hexSticker)

# https://www.charite.de/typo3conf/ext/charite_site/Resources/Public/Icon/favicon.png
icon <- "images/charite_icon.png"

sticker(icon,
        package = "charithesis",
        p_family = "serif",
        p_size = 8, p_color = "#5B5040", # p_x = 4, p_y = 1.4,
        s_x = 1, s_y = 0.75, s_width = 0.55, asp = 0.8,
        h_fill = "#FAECC7", h_color = "#5B5040",
        filename = "charithesis_hex.png",
        dpi = 720
        # url = "thesisdown.rbind.io"
)
