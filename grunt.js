// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
// Make sure grunt and grunt-less are installed
// /path/to/timeline/$ npm install grunt
// /path/to/timeline/$ npm install grunt-less
//
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-less');
    grunt.initConfig({

        // concat our files
        concat: {
            timeline: {
                src: [
                        "source/js/VMM.Timeline.License.js",
                        "source/js/VMM.js",
                        "source/js/VMM.Library.js",
                        "source/js/VMM.Browser.js",
                        "source/js/VMM.MediaElement.js",
                        "source/js/VMM.MediaType.js",
                        "source/js/VMM.Media.js",
                        "source/js/VMM.FileExtention.js",
                        "source/js/VMM.ExternalAPI.js",
                        "source/js/VMM.TouchSlider.js",
                        "source/js/VMM.DragSlider.js",
                        "source/js/VMM.Slider.js",
                        "source/js/VMM.Slider.Slide.js",
                        "source/js/VMM.Util.js",
                        "source/js/VMM.LoadLib.js",
                        "source/js/VMM.Language.js",
                        "source/js/lib/AES.js",
                        "source/js/lib/bootstrap-tooltip.js",
                        "source/js/VMM.Timeline.js",
                        "source/js/VMM.Timeline.TimeNav.js",
                        "source/js/VMM.Timeline.DataObj.js"
                    ],
                dest: "timeline.js"
            },
            timelineEmbed: {
                src: ["source/js/lib/Embed.LoadLib.js", "source/js/timeline-embed.js"],
                dest: "timeline-embed.js"
            }
        },
        min: {
            timeline: {
                src: ["timeline.js"],
                dest: "timeline-min.js"
            },
            timelineEmbed: {
                src: ["timeline-embed.js"],
                dest: "timeline-embed.js"
            }
        },
        less: {
            timeline: {
                src: ["source/less/VMM.Timeline.less"],
                dest: "timeline.css"
            }
        }
    });
    grunt.registerTask("default", "concat min less")
    grunt.registerTask("debug", "concat less")
}
