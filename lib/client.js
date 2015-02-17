(function(global) {
    'use strict';
    
    if (typeof module !== 'undefined' && module.exports)
        module.exports      = new WebProgress();
    else
        global.progress     = new WebProgress();
    
    function WebProgress() {
        var progress = function(el, callback) {
                var elProgress,
                    tmpl = '<progress data-name="js-progress" value="0">';
                    
                if (typeof el === 'string')
                    el = document.querySelector(el);
                
                el.innerHTML = tmpl;
                
                elProgress = document.querySelector('[data-name="js-progress"]');
                
                loadScript('/webprogress/modules/load/load.js', function() {
                });
                
                return update.bind(null, elProgress);
            };
        
        function update(el, value) {
            el.value    = value / 100;
        }
        
        function loadScript(srcs, callback) {
            var i,
                func    = function() {
                    --i;
                    
                    if (!i)
                        callback();
                };
            
            if (typeof srcs === 'string')
                srcs = [srcs];
            
            i = srcs.length;
            
            srcs.forEach(function(src) {
                var element = document.createElement('script');
            
                element.src = src;
                element.addEventListener('load', function load() {
                    func();
                    element.removeEventListener('load', load);
                });
            
                document.body.appendChild(element);
            });
        }
        
        return progress;
    }
    
})(this);
