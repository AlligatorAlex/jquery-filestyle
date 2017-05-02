/*
 * jQuery File Style v1.0.2
 * https://github.com/AlligatorAlex/jquery-filestyle
 *
 * Copyright 2017 Pixel Plus
 *
 * May 2 2017
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
        multipleText: 'Число файлов: %s',
        removeText: 'Удалить',
        lang: 'ru',
        languages: {
            'en': {
                placeholderText: 'No file chosen',
                multipleText: '%s files',
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

        // Labels from data-attributes
        if (typeof element.data('browse') !== 'undefined') {
            self.options.browseText = element.data('browse');
        }

        if (typeof element.data('placeholder') !== 'undefined') {
            self.options.placeholderText = element.data('placeholder');
        }

        if (typeof element.data('remove') !== 'undefined') {
            self.options.removeText = element.data('remove');
        }

        if (typeof element.data('multiple-text') !== 'undefined') {
            self.options.multipleText = element.data('multiple-text');
        }

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

        var fileName = $('<div class="file-name placeholder">')
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

        // Fake multiple
        var isMultiple = (typeof self.options.multiple !== 'undefined') ? self.options.multiple : element.data('multiple');

        // File selecting / changing
        element.on('change.filestyle', function() {

            var selectedFileName = '',
                filesCount = 0;

            for (var i = 0; i < element[0].files.length; i++) {
                filesCount++;
            }

            if (filesCount === 0) {
                // If no file selected
                selectedFileName = self.options.placeholderText;
            } else if (filesCount === 1) {
                // If only one file selected, paste files count
                selectedFileName = element.val().replace(/.+[\\\/]/, '');
            } else if (filesCount > 1) {
                // If more than one file selected, paste files count
                selectedFileName = self.options.multipleText.replace(/%s/, filesCount.toString())
            } else {
                selectedFileName = self.options.placeholderText;
            }

            if (filesCount > 0) {
                // Remove placeholder class
                fileName.removeClass('placeholder');
                // Paste remove button
                element.closest('.file-item').removeClass('file-empty').append(fileRemoveButton);
            } else {
                // Add placeholder class
                fileName.addClass('placeholder');
                // Delete remove button
                element.closest('.file-item').find('.file-button-remove').remove();
            }

            // Pasting file name / files count / placeholder text
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