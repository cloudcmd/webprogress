(function(global) {
    'use strict';
    
    if (typeof module !== 'undefined' && module.exports)
        module.exports      = new WebProgress();
    else
        global.progress     = new WebProgress();
    
    function WebProgress() {
        var progress    = function(el) {
                var tmpl = '<progress data-name="js-progress" value="0">';
                
                if (typeof el === 'string')
                    el = document.querySelector(el);
            
                el.innerHTML = tmpl;
            };
        
        progress.update   = function(value) {
            var el = document.querySelector('[data-name="js-progress"]');
            el.value = value;
        };
        
        return progress;
    }
    
})(this);
