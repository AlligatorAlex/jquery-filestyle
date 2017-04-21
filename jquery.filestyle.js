/*
 * jQuery File Style v1.0.0
 * https://github.com/AlligatorAlex/jquery-filestyle
 *
 * Copyright 2017 Pixel Plus
 *
 * April 21 2017
*/
;(function($) {
    'use strict';

    if (!$) {
        return undefined;
    }

    var pluginName = 'filestyle';
    var defaults = {
        browseText: 'Выберите файл',
        placeholderText: 'Файл не выбран',
        removeText: 'Удалить',
        lang: 'ru',
        languages: {
            'en': {
                placeholderText: 'No file chosen',
                browseText: 'Choose File',
                removeText: 'Remove'
            }
        }
    };

    function FileStylePlugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        var lang = this.options.lang;

        if (this.options.languages[lang] !== undefined) {
            $.extend(this.options, this.options.languages[lang]);
        }

        this.init();
    }

    FileStylePlugin.prototype.init = function() {
        var self = this;

        var element = $(self.element);
        var elementClone = element.clone();

        // Hide original input element
        element.css({
            'position': 'absolute',
            'top': '0',
            'right': '0',
            'opacity': '0',
            'font-size': '120px'
        });

        var fileWrapper = $('<div class="file-style-wrapper">')
            .addClass(element.prop('class'));

        var fileItem = $('<div class="file-item">')
            .addClass('file-empty');

        var fileInput = $('<div class="file-input">')
            .css({
                'position': 'relative',
                'overflow': 'hidden'
            });

        var fileName = $('<div class="file-name">')
            .html(self.options.placeholderText);

        var fileBrowseButton = $('<div class="file-button-browse">')
            .html(self.options.browseText);

        var fileRemoveButton = $('<div class="file-button-remove">')
            .html(self.options.removeText);

        if (typeof self.options.wrapClass !== 'undefined' && self.options.wrapClass !== '') {
            fileWrapper.addClass(self.options.wrapClass);
        }

        // Items wrapper
        if (element.closest('.file-style-wrapper').length === 0) {
            element.wrap(fileWrapper);
        }

        // Single item
        element.wrap(fileItem);
        element.wrap(fileInput);
        element.before(fileBrowseButton);
        element.before(fileName);

        var isMultiple = (typeof self.options.multiple !== 'undefined') ? self.options.multiple : element.data('multiple');

        // File selecting / changing
        element.on('change.filestyle', function() {

            var selectedFileName = element.val().replace(/.+[\\\/]/, '');

            // If no file selected
            if (selectedFileName === '') {
                selectedFileName = self.options.placeholderText;
                element.closest('.file-item').find('.file-button-remove').remove();
            } else {
                // Pasting remove button
                element.closest('.file-item').removeClass('file-empty').append(fileRemoveButton);
            }

            // Pasting file name
            fileName.html(selectedFileName);

            if (isMultiple === true) {
                // Prevent duplication of empty file inputs
                if (element.closest('.file-style-wrapper').find('.file-item.file-empty').length === 0) {
                    var wrapper = element.closest('.file-style-wrapper');

                    elementClone = elementClone.clone().appendTo(wrapper);
                    elementClone.filestyle(self.options);
                }
            }
        });

        // File removing
        fileRemoveButton.on('click.filestyle', function() {
            var wrapper;

            if (isMultiple === true) {
                // If multiple, then remove parent item only
                wrapper = fileRemoveButton.closest('.file-item');

                wrapper.remove();
            } else {
                // If single, we can replace all html content
                wrapper = fileRemoveButton.closest('.file-style-wrapper');

                wrapper.html('');
                wrapper.append(elementClone);
                elementClone.filestyle(self.options);
            }
        });
    };

    // Destroying plugin
    FileStylePlugin.prototype.destroy = function() {
        var self = this;

        var element = $(self.element);
        var wrapper = element.closest('.file-style-wrapper');

        wrapper.html('');
        element.appendTo(wrapper);
        element.unwrap();
        element.removeAttr('style');
    };

    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            if (!(this instanceof $)) {
                $.extend(defaults, options);
            }
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new FileStylePlugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (!instance) {
                    instance = $.data(this, 'plugin_' + pluginName, new FileStylePlugin(this, options));
                }

                if (instance instanceof FileStylePlugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }

                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });

            return returns !== undefined ? returns : this;
        }
    };
})(jQuery);