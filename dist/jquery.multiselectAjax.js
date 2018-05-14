/**
 * *********************************************************************************************
 * multiselectAjax (https://github.com/kiaonline/multiselectAjax)
 * this plugin require bootstrap-multiselect plugin: https://github.com/davidstutz/bootstrap-multiselect
 * Author: kiaonline
 * homepage: dialogo.digital
 * *********************************************************************************************
 * example:
 * Using simple url string:
 * $(selectElement).multiselectAjax(strUrl);
 * or using jQuery ajax params:
 * $(selectElement).multiselectAjax({
        url:...
        method:...
        dataType:..
        ...
    });
 */
(function($) {
    
    
    function buildFilter(el,filterValue){
        
        var $options    = el.options;
        var $select     = el.$select;
        var $ul         = el.$ul;
        var templates   = $options.templates;
        var $filter     = $ul.find('.multiselect-filter') || false;
        
        if($filter.length===0){
            $filter         = $(templates.filter);
            var clearBtn    = $(templates.filterClearBtn);
            $filter.find('.input-group').append(clearBtn);
            $ul.prepend($filter);
        }
        var $input      = $filter.find('.multiselect-search');
        setTimeout(function(){
            $input.focus().val(filterValue);
        },100);
        return $filter;
    }

    function initDropdown(el){
        
        var query           = '';
        var $options        = el.options;
        var $select         = el.$select;
        var $ul             = el.$ul;
        var $filter         = buildFilter(el,query);
        var $input          = $filter.find('.multiselect-search');
        var $clearFilter    = $filter.find('.multiselect-clear-filter');
        var ajaxOptions     = $select.data('multiselectAjax');

        $clearFilter.click(function(){
            $input.val('');
            $select.empty();
            $ul.find('li').not($filter).remove();
        });

        var timeout = null;
        $filter.val(query).on('click', function(event) {
            event.stopPropagation();
        }).on('input keydown', $.proxy(function(event) {
            
            //tab
            if (event.which === 9) {
                return true;
            }
            // Cancel enter key default behaviour
            if (event.which === 13) {
                event.preventDefault();
            }
            var v = event.target.value;
            if(v.toString().trim().length === 0) return true;
            
            $select.empty();
            $ul.find('li').not($filter).remove();
            
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                query   = event.target.value;
                $.ajax({
                    url         :ajaxOptions.url,
                    method      :ajaxOptions.method,
                    dataType    :ajaxOptions.dataType,
                    data:{
                        query   :query
                    },
                    success:function(data){
                        if(!data) return true;
                        
                        var inputType   = $options.multiple ? "checkbox" : "radio";
                        
                        $(data).each(function(){
                            console.log(this);
                            var label   = this.value;
                            var value   = this.id;
                            $select.append($("<option />").val(value).text(label));

                            var $li     = $($options.templates.li);
                            var $label = $('label', $li);
                            $label.addClass(inputType);
                            $label.attr("title", label);
                            
                            $label.text(" " + label);
                            var $checkbox = $('<input/>').attr('type', inputType);
                            $label.prepend($checkbox);
                            $checkbox.val(value);
                            $ul.append($li);
                        });
                        $ul.find('li:not(.multiselect-filter)').first().addClass('active').find('a').focus();
                       
                    }
                });    
            }, 500);
            
        }));
    }

    var multiselectOptions = {
       
        onDropdownShow:function(){
            var $ul = this.$ul;
            setTimeout(function(){
                $ul.find('.multiselect-filter input').focus();
            },100);
        },
        onInitialized:function(){
            initDropdown(this);
        }
    };

    var MultiselectAjax = function(el,ajaxOptions,options){
        var $el = $(el);
        if(ajaxOptions == undefined){
            console.error("ajaxOption url not defined");
            return false;
        }
        var data        = $el.data('multiselect'),
            dataAjax    = $el.data('multiselectAjax');

        if(typeof ajaxOptions == 'string'){
            ajaxOptions = {url:ajaxOptions};
        }
        
        ajaxOptions = $.extend({
            url         : null,
            dataType    :'json',
            method      :'POST'
        },ajaxOptions);

        $el.data('multiselectAjax',ajaxOptions);

        options         = $.extend({},options,multiselectOptions);
        
        if(data == undefined){
            return $el.multiselect(options);
        }

        return this;
        
    };

    $.fn.multiselectAjax = function(url,options){
        return this.each(function() {
            try {
                $.fn.multiselect();
            } catch (error) {
                alert(error);
                return false;
            }
            return new MultiselectAjax(this, url, options);
            
        });
    };

})(jQuery);