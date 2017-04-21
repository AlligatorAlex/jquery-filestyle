# jQuery File Style
> 1.0.0

jQuery-плагин для стилизации элемента ```<input type="file">```

# Подключение
1. Подключите библиотеку jQuery (**требуется версия 1.7.0 или выше**)
```javascript
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
```
2. Подключите плагин и его стили в области ```<head>```
```javascript
<link href="../jquery.filestyle.css" rel="stylesheet">
<script src="../jquery.filestyle.min.js"></script>
```

# Инициализация
```javascript
$('input[type=file]').filestyle();
```

После инициализации плагина получится следующая html-структура:
```html
<div class="file-style-wrapper">
    <div class="file-item">
        <div class="file-input">
            <div class="file-button-browse">Выберите файл</div>
            <div class="file-name">Файл не выбран</div>
            <input type="file" name="ATTACHMENT">
        </div>
        <div class="file-button-remove">Удалить</div>
    </div>
</div>
```

# Настройка

### Множественная загрузка
> Параметр **multiple**

Для каждого файла создаётся отдельный input, обёрнутый в ```<div class="file-item">```
```javascript
$('input[type=file]').filestyle({
    multiple: true
});
```
```html
<!-- или data-атрибут -->
<input type="file" name="ATTACHMENT[]" data-multiple="true">
```

### Собственные надписи
> Параметр **browseText**
>
> Параметр **placeholderText**
>
> Параметр **removeText**

```javascript
$('input[type=file]').filestyle({
    browseText: 'Обзор',
    placeholderText: 'Выберите файл'
});
```
```html
<!-- или data-атрибуты -->
<input type="file" name="ATTACHMENT" data-browse="Обзор" data-placeholder="Выберите файл">
```

### Собственные надписи с HTML
> Параметр **browseText**
>
> Параметр **placeholderText**
>
> Параметр **removeText**

```javascript
$('input[type=file]').filestyle({
    browseText: '<i class="material-icons">search</i> Обзор',
    removeText: '<i class="material-icons">delete</i>'
});
```
```html
<!-- или data-атрибуты -->
<input type="file" name="ATTACHMENT"
    data-browse="<i class='material-icons'>search</i> Обзор"
    data-remove="<i class='material-icons'>delete</i>">
```

### Локализация
> Параметр **lang**
>
> Параметр **languages**

Значение по умолчанию: **'ru'**

Английская локализация входит в состав плагина (**lang: 'en'**)
```javascript
$('input[type=file]').filestyle({
    lang: 'sweden'
    languages: {
        'sweden': {
            browseText: 'Välj fil',
            placeholderText: 'Ingen fil vald',
            removeText: 'Avlägsna'
        }
    }
});
```

### Дополнительные классы
> Параметр **wrapClass**

Класс добавляется к родительскому элементу ```<div class="file-style-wrapper">```
```javascript
$('input[type=file]').filestyle({
    wrapClass: 'accent'
});
```
```html
<!-- или атрибут class -->
<input type="file" name="ATTACHMENT" class="accent">
```

### Уничтожение плагина
> Параметр **destroy**

```javascript
$('input[type=file]').filestyle('destroy');
```
