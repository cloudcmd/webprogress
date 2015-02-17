(function(global) {
    'use strict';
    
    if (typeof module !== 'undefined' && module.exports)
        module.exports      = new WebProgress();
    else
        global.progress     = new WebProgress();
    
    function WebProgress() {
        var progress = function(el) {
                var elProgress,
                    tmpl = '<progress data-name="js-progress" value="0">';
                    
                if (typeof el === 'string')
                    el = document.querySelector(el);
                
                el.innerHTML = tmpl;
                
                elProgress = document.querySelector('[data-name="js-progress"]');
                
                return update.bind(null, elProgress);
            };
        
        function update(el, value) {
            el.value    = value / 100;
        }
        
        return progress;
    }
    
})(this);
