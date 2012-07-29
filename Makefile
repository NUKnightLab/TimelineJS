JS_START =	"/*********************************************** "
JS_END =	"***********************************************/ "

BUILD_DIR = compiled
JS_BUILD_DIR = $(BUILD_DIR)/js
JS_OBJ = $(JS_BUILD_DIR)/timeline.js
JS_MIN_OBJ = $(JS_BUILD_DIR)/timeline-min.js
JS_EMBED_OBJ = $(JS_BUILD_DIR)/storyjs-embed.js
JS_LOCALE_BUILD_DIR = $(JS_BUILD_DIR)/locale

CSS_BUILD_DIR = $(BUILD_DIR)/css
CSS_THEME_BUILD_DIR = $(CSS_BUILD_DIR)/themes
CSS_FONT_BUILD_DIR = $(CSS_THEME_BUILD_DIR)/font
CSS_TIMELINE_OBJ = $(CSS_BUILD_DIR)/timeline.css
CSS_THEME_OBJ = $(CSS_THEME_BUILD_DIR)/dark.css

SRC_DIR = source
JS_SRC_DIR = $(SRC_DIR)/js
JS_CORE_DIR = $(SRC_DIR)/js/Core

LICENSE = $(JS_SRC_DIR)/VMM.Timeline.License.js

JS_CORE_SRCS = 	$(JS_CORE_DIR)/Core/VMM.js \
				$(JS_CORE_DIR)/Core/VMM.Library.js \
				$(JS_CORE_DIR)/Core/VMM.Browser.js \
				$(JS_CORE_DIR)/Core/VMM.FileExtention.js \
				$(JS_CORE_DIR)/Core/VMM.Date.js \
				$(JS_CORE_DIR)/Core/VMM.Util.js \
				$(JS_LAZYLOAD_SRC) \
				$(JS_CORE_DIR)/Core/VMM.LoadLib.js \
				$(JS_CORE_DIR)/Core/VMM.Core.js
			
JS_MEDIA_SRCS =	$(JS_CORE_DIR)/Media/VMM.ExternalAPI.js \
				$(JS_CORE_DIR)/Media/VMM.MediaElement.js \
				$(JS_CORE_DIR)/Media/VMM.MediaType.js \
				$(JS_CORE_DIR)/Media/VMM.TextElement.js \
				$(JS_CORE_DIR)/Media/VMM.Media.js
				
JS_SLIDER_SRCS =$(JS_CORE_DIR)/Slider/VMM.DragSlider.js \
				$(JS_CORE_DIR)/Slider/VMM.Slider.js \
				$(JS_CORE_DIR)/Slider/VMM.Slider.Slide.js

JS_LIB_SRCS =	$(JS_CORE_DIR)/Library/AES.js \
				$(JS_CORE_DIR)/Library/bootstrap-tooltip.js

JS_SRCS =		$(JS_CORE_DIR)/VMM.StoryJS.License.js \
				$(JS_CORE_SRCS) \
				$(JS_CORE_DIR)/Language/VMM.Language.js \
				$(JS_MEDIA_SRCS) \
				$(JS_SLIDER_SRCS) \
				$(JS_LIB_SRCS) \
				$(JS_CORE_DIR)/VMM.StoryJS.js \
				$(JS_SRC_DIR)/VMM.Timeline.js \
				$(JS_SRC_DIR)/VMM.Timeline.TimeNav.js \
				$(JS_SRC_DIR)/VMM.Timeline.DataObj.js

JS_LOCALE_SRC_DIR = $(JS_CORE_DIR)/Language/locale
JS_LOCALE_SRCS =	$(wildcard $(JS_LOCALE_SRC_DIR)/*.js)


LESS_SRC_DIR =			$(SRC_DIR)/less
LESS_SRCS =				$(wildcard $(LESS_SRC_DIR)/Core/*.less $(LESS_SRC_DIR)/*.less)
LESS_TIMELINE_SRC =		$(LESS_SRC_DIR)/VMM.Timeline.less
LESS_THEME_DIR =		$(SRC_DIR)/less/Theme
LESS_THEME_SRC =	 	$(LESS_THEME_DIR)/Dark.less
LESS_FONT_DIR =			$(SRC_DIR)/less/Core/Font
LESS_FONT_SRCS = 		$(wildcard $(LESS_FONT_DIR)/*.less)


JS_LAZYLOAD_SRC =		$(JS_CORE_DIR)/Library/LazyLoad.js
JS_EMBED_DIR =			$(JS_CORE_DIR)/Embed
JS_EMBED_SRCS =			$(JS_EMBED_DIR)/Embed.LoadLib.js \
						$(JS_EMBED_DIR)/Embed.js
						
JS_EMBED_CDN_SRC =		$(JS_EMBED_DIR)/Embed.CDN.js
JS_EMBED_CDN_OTHER_SRCS = $(JS_LAZYLOAD_SRC) \
						$(JS_EMBED_SRCS)
						
JS_EMBED_CDN_OBJ =		$(JS_BUILD_DIR)/storyjs-embed-cdn.js

JS_EMBED_GENERATOR_SRC =$(JS_EMBED_DIR)/Embed.CDN.Generator.js
JS_EMBED_GENERATOR_OBJ =$(JS_BUILD_DIR)/storyjs-embed-generator.js

JS_LOCALE_OBJS =		$(patsubst %.js, $(JS_LOCALE_BUILD_DIR)/%.js, $(notdir $(JS_LOCALE_SRCS)))
CSS_FONT_OBJS =			$(patsubst %.less, $(CSS_FONT_BUILD_DIR)/%.css, $(notdir $(LESS_FONT_SRCS)))

.PHONY: all clean

all: js css

js: $(JS_MIN_OBJ) $(JS_EMBED_OBJ) $(JS_EMBED_CDN_OBJ) $(JS_EMBED_GENERATOR_OBJ) $(JS_LOCALE_OBJS)

$(JS_MIN_OBJ): $(JS_OBJ)
	yui-compressor $(JS_OBJ) -o $(JS_MIN_OBJ)

$(JS_OBJ): $(LICENSE) $(JS_SRCS)
	@echo "	Merging "$(LICENSE)	
	@cat $(LICENSE) > $@
	@echo "" >> $@
	
	@for src in $(JS_SRCS); do \
		echo "	Merging "$$src; \
		echo "" >> $@; \
		echo $(JS_START) >> $@; \
		echo "     Begin "`basename $$src`" " >> $@; \
		echo $(JS_END) >> $@; \
		echo "" >> $@; \
		cat $$src >> $@; \
		echo "" >> $@; \
	done

$(JS_EMBED_OBJ): $(JS_LAZYLOAD_SRC)	$(JS_EMBED_SRCS)
	@echo "	Merging "$(JS_LAZYLOAD_SRC)
	@cat $(JS_LAZYLOAD_SRC) > $@
	@echo "" >> $@
	
	@for src in $(JS_EMBED_SRCS); do \
		echo "	Merging "$$src; \
		echo "" >> $@; \
		echo $(JS_START) >> $@; \
		echo "     Begin "`basename $$src`" " >> $@; \
		echo $(JS_END) >> $@; \
		echo "" >> $@; \
		cat $$src >> $@; \
		echo "" >> $@; \
	done
	
$(JS_EMBED_CDN_OBJ): $(JS_EMBED_CDN_SRC) $(JS_EMBED_CDN_OTHER_SRCS)
	@echo "	Merging "$(JS_EMBED_CDN_SRC)	
	@cat $(JS_EMBED_CDN_SRC) > $@
	@echo "" >> $@
	
	@for src in $(JS_EMBED_CDN_OTHER_SRCS); do \
		echo "	Merging "$$src; \
		echo "" >> $@; \
		echo $(JS_START) >> $@; \
		echo "     Begin "`basename $$src`" " >> $@; \
		echo $(JS_END) >> $@; \
		echo "" >> $@; \
		cat $$src >> $@; \
		echo "" >> $@; \
	done
	
$(JS_EMBED_GENERATOR_OBJ): $(JS_EMBED_GENERATOR_SRC)
	yui-compressor $< -o $@
	
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
	rm $(JS_OBJ) $(CSS_TIMELINE_OBJ) $(CSS_THEME_OBJ) $(CSS_FONT_OBJS) $(JS_EMBED_OBJ) $(JS_EMBED_CDN_OBJ) $(JS_EMBED_GENERATOR_OBJ) $(JS_LOCALE_OBJS) $(JS_MIN_OBJ)
