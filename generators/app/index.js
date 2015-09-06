'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the grand ' + chalk.red('AlbaWebApp') + ' generator!'
        ));


        var prompts = [
            {
                type: 'input',
                name: 'appName',
                message: 'First, tell me the name of your awesome project !',
                default: this.appname
            },
            {
                type: 'list',
                name: 'cssFramework',
                message: 'Would you want to use a CSS Framework ?',
                choices: [
                    'no',
                    'bootstrap',
                    'bootstrap-less',
                    'foundation',
                    'materializecss'
                ]
            },
            {
                type: 'confirm',
                name: 'includeLessHat',
                message: 'Would you want to use lessHat ?',
                default: true
            },
            {
                type: 'confirm',
                name: 'includeJQuery',
                message: 'Would you like to include jQuery?',
                default: true,
                when: function (answers) {
                    return (answers.cssFramework === 'no');
                }
            },
            {
                type: 'confirm',
                name: 'isCountdown',
                message: 'Tell me if you are making a countdown ?',
                default: false
            },
            {
                type: 'confirm',
                name: 'jqueryByDefault',
                message: 'do you want that app.js file load jQuery ?',
                default: false,
                when: function (answers) {
                    return (answers.cssFramework !== 'no' || answers.includeJQuery === true);
                }
            },
            {
                type: 'list',
                name: 'resetCss',
                message: 'Would you want to use a reset or normalize ?',
                choices: [
                    'no',
                    'reset.css',
                    'normalize.css'
                ]
            },
            {
                type: 'confirm',
                name: 'includeModernizr',
                message: 'Would you want to use Mordernizr ?',
                default: true
            }
        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            this.appName = this.props.appName;
            this.addDemoSection = this.props.addDemoSection;
            this.cssFramework = this.props.cssFramework;
            this.includeModernizr = this.props.includeModernizr;
            this.isCountdown = this.props.isCountdown;
            this.includeJQuery = this.props.includeJQuery;
            this.includeModernizr = this.props.includeModernizr;
            this.includeLessHat = this.props.includeLessHat;
            this.jqueryByDefault = this.props.jqueryByDefault;
            this.resetCss = this.props.resetCss;

            done();
        }.bind(this));
    },

    scaffoldFolders: function () {
        mkdirp('css');
        mkdirp('less');
        mkdirp('js');
        mkdirp('js/lib');
        mkdirp('fonts');
        mkdirp('img');
    },

    checkCssFramework: function () {
        this.includeBootstrap = this.cssFramework === 'bootstrap';
        this.includeBootstrapLess = this.cssFramework === 'bootstrap-less';
        this.includeFoundation = this.cssFramework === 'foundation';
        this.includeMaterialize = this.cssFramework === 'materializecss';
    },

    copyMainFiles: function () {

    },


    writing: {
        app: function () {
            var jsSourcePath;

            this.fs.copy(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );

            this.fs.copy(
                this.templatePath('_gulpfile.js'),
                this.destinationPath('gulpfile.js')
            );

            this.fs.copy(
                this.templatePath('less/_mixins.less'),
                this.destinationPath('less/mixins.less')
            );

            this.fs.copy(
                this.templatePath('less/_variables.less'),
                this.destinationPath('less/variables.less')
            );

            /* APP.JS FILE */
            if (this.isCountdown) {
                if (this.jqueryByDefault) {
                    jsSourcePath = 'js/_app_jquery_cd.js';
                } else {
                    jsSourcePath = 'js/_app_cd.js';
                }
                this.fs.copy(
                    this.templatePath(jsSourcePath),
                    this.destinationPath('js/app.js')
                );
            } else {
                if (this.jqueryByDefault) {
                    jsSourcePath = 'js/_app_jquery.js';
                } else {
                    jsSourcePath = 'js/_app.js';
                }
                this.fs.copy(
                    this.templatePath(jsSourcePath),
                    this.destinationPath('js/app.js')
                );
            }

            if (this.resetCss !== 'no') {
                this.fs.copy(
                    this.templatePath('css/' + this.resetCss),
                    this.destinationPath('css/' + this.resetCss)
                );
            }


            var context = {
                appName: this.appName,
                loadJQuery: this.jqueryByDefault === true ?
                    '<script src="bower_components/jquery/dist/jquery.min.js"></script>' : null,
                lessHat: this.includeLessHat === true ? '@import "../bower_components/lesshat/build/lesshat";' : null,
                loadJS: '<script src="js/app.js"></script>',
                resetCss: this.resetCss ? '<link rel="stylesheet" href="css/' + this.resetCss + '"/>' : null,
                countdownDiv: this.isCountdown ? '<div class="countdown"></div>' : null,
                loadCountdown: this.isCountdown ?
                    '<script src="bower_components/simplycountdown.js/dist/simplyCountdown.min.js"></script>' : null
            };

            this.template('_index.html', 'index.html', context, null);
            this.template('less/_app.less', 'less/app.less', context, null);
        },

        bower: function () {
            var bowerJson = {
                name: _s.slugify(this.appname),
                private: true,
                dependencies: {}
            };

            if (this.cssFramework !== 'no') {
                if (this.includeBootstrapLess) {
                    bowerJson.dependencies['bootstrap-less'] = '~3.3.4';
                    bowerJson.overrides = {
                        'bootstrap-sass': {
                            'main': [
                                'assets/stylesheets/_bootstrap.scss',
                                'assets/fonts/bootstrap/*',
                                'assets/javascripts/bootstrap.js'
                            ]
                        }
                    };

                } else if (this.includeBootstrap) {
                    bowerJson.dependencies['bootstrap'] = '~3.3.5';
                    bowerJson.overrides = {
                        'bootstrap': {
                            'main': [
                                'less/bootstrap.less',
                                'dist/css/bootstrap.css',
                                'dist/js/bootstrap.js',
                                'dist/fonts/*'
                            ]
                        }
                    };

                } else if (this.includeFoundation) {
                    bowerJson.dependencies['foundation'] = '*';

                } else if (this.includeMaterialize) {
                    bowerJson.dependencies['materialize'] = '*';
                }

            } else if (this.includeJQuery) {
                bowerJson.dependencies['jquery'] = '~2.1.2';
            }

            if (this.includeModernizr) {
                bowerJson.dependencies['modernizr'] = '~2.8.1';
            }

            if (this.includeLessHat) {
                bowerJson.dependencies['lesshat'] = '~3.0.0';
            }

            if (this.isCountdown) {
                bowerJson.dependencies['simplycountdown.js'] = '*';
            }

            this.fs.writeJSON('bower.json', bowerJson);
        },

        projectfiles: function () {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );

            this.fs.copy(
                this.templatePath('_gitignore'),
                this.destinationPath('.gitignore')
            );
        }
    },

    install: function () {
        this.installDependencies();
    }
});
