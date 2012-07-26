JS_START =	"/*********************************************** "
JS_END =	"***********************************************/ "

BUILD_DIR = compiled
JS_BUILD_DIR = $(BUILD_DIR)/js
JS_OBJ = $(JS_BUILD_DIR)/timeline.js
JS_MIN_OBJ = $(JS_BUILD_DIR)/timeline-min.js
JS_LOCALE_BUILD_DIR = $(JS_BUILD_DIR)/locale

CSS_BUILD_DIR = $(BUILD_DIR)/css
CSS_THEME_BUILD_DIR = $(CSS_BUILD_DIR)/themes
CSS_FONT_BUILD_DIR = $(CSS_THEME_BUILD_DIR)/font
CSS_TIMELINE_OBJ = $(CSS_BUILD_DIR)/timeline.css
CSS_THEME_OBJ = $(CSS_THEME_BUILD_DIR)/dark.css

SRC_DIR = source
JS_SRC_DIR = $(SRC_DIR)/js

LICENSE = $(JS_SRC_DIR)/VMM.Timeline.License.js

JS_CORE_SRCS = 	$(JS_SRC_DIR)/Core/VMM.js \
				$(JS_SRC_DIR)/Core/VMM.Library.js \
				$(JS_SRC_DIR)/Core/VMM.Browser.js \
				$(JS_SRC_DIR)/Core/VMM.FileExtention.js \
				$(JS_SRC_DIR)/Core/VMM.Date.js \
				$(JS_SRC_DIR)/Core/VMM.Util.js \
				$(JS_SRC_DIR)/Core/VMM.LoadLib.js
			
JS_MEDIA_SRCS =	$(JS_SRC_DIR)/Media/VMM.ExternalAPI.js \
				$(JS_SRC_DIR)/Media/VMM.MediaElement.js \
				$(JS_SRC_DIR)/Media/VMM.MediaType.js \
				$(JS_SRC_DIR)/Media/VMM.Media.js\
				$(JS_SRC_DIR)/Media/VMM.TextElement.js
				
JS_SLIDER_SRCS =$(JS_SRC_DIR)/Slider/VMM.DragSlider.js \
				$(JS_SRC_DIR)/Slider/VMM.Slider.js \
				$(JS_SRC_DIR)/Slider/VMM.Slider.Slide.js

JS_LIB_SRCS =	$(JS_SRC_DIR)/lib/AES.js \
				$(JS_SRC_DIR)/lib/bootstrap-tooltip.js

JS_SRCS =		$(JS_CORE_SRCS) \
				$(JS_MEDIA_SRCS) \
				$(JS_SLIDER_SRCS) \
				$(JS_SRC_DIR)/VMM.Language.js \
				$(JS_LIB_SRCS) \
				$(JS_SRC_DIR)/VMM.Timeline.js \
				$(JS_SRC_DIR)/VMM.Timeline.TimeNav.js \
				$(JS_SRC_DIR)/VMM.Timeline.DataObj.js

JS_LOCALE_SRC_DIR = $(JS_SRC_DIR)/locale
JS_LOCALE_SRCS =	$(wildcard $(JS_LOCALE_SRC_DIR)/*.js)


LESS_SRC_DIR =			$(SRC_DIR)/less
LESS_SRCS =				$(wildcard $(LESS_SRC_DIR)/*.less)
LESS_TIMELINE_SRC =		$(LESS_SRC_DIR)/VMM.Timeline.less
LESS_THEME_DIR =		$(SRC_DIR)/less/Theme
LESS_THEME_SRC =	 	$(LESS_THEME_DIR)/Dark.less
LESS_FONT_DIR =			$(SRC_DIR)/less/Font
LESS_FONT_SRCS = 		$(wildcard $(LESS_FONT_DIR)/*.less)

JS_LOCALE_OBJS =		$(patsubst %.js, $(JS_LOCALE_BUILD_DIR)/%.js, $(notdir $(JS_LOCALE_SRCS)))
CSS_FONT_OBJS =			$(patsubst %.less, $(CSS_FONT_BUILD_DIR)/%.css, $(notdir $(LESS_FONT_SRCS)))

.PHONY: all clean

all: js css

js: $(JS_MIN_OBJ) $(JS_LOCALE_OBJS)

$(JS_MIN_OBJ): $(JS_OBJ)
	yui-compressor $(JS_OBJ) -o $(JS_MIN_OBJ)

$(JS_OBJ): $(LICENSE) $(JS_SRCS)
	@echo "	Merging "$(LICENSE)	
	@cat $(LICENSE) > $(JS_OBJ)
	@echo "" >> $(JS_OBJ)
	
	@for src in $(JS_SRCS); do \
		echo "	Merging "$$src; \
		echo "" >> $(JS_OBJ); \
		echo $(JS_START) >> $(JS_OBJ); \
		echo "     Begin "`basename $$src`" " >> $(JS_OBJ); \
		echo $(JS_END) >> $(JS_OBJ); \
		echo "" >> $(JS_OBJ); \
		cat $$src >> $(JS_OBJ); \
		echo "" >> $(JS_OBJ); \
	done
	
$(JS_LOCALE_OBJS): $(JS_LOCALE_BUILD_DIR)/%.js : $(JS_LOCALE_SRC_DIR)/%.js
	yui-compressor $< -o $@
	
css: $(CSS_TIMELINE_OBJ) $(CSS_THEME_OBJ) $(CSS_FONT_OBJS)
	
$(CSS_TIMELINE_OBJ): $(LESS_SRCS)
	lessc -x $(LESS_TIMELINE_SRC) $(CSS_TIMELINE_OBJ)
	
$(CSS_THEME_OBJ): $(LESS_SRCS) $(LESS_THEME_SRC)
	lessc -x $(LESS_THEME_SRC) $(CSS_THEME_OBJ)
	
$(CSS_FONT_OBJS): $(CSS_FONT_BUILD_DIR)/%.css : $(LESS_FONT_DIR)/%.less
	lessc -x $< $@
	
clean:
	rm $(JS_OBJ) $(CSS_TIMELINE_OBJ) $(CSS_THEME_OBJ) $(CSS_FONT_OBJS) $(JS_LOCALE_OBJS) $(JS_MIN_OBJ)
