(function() {
    'use strict';
    
    var io              = require('socket.io'),
        debug           = require('debug'),
        logConsole      = debug('webprogress'),
        logClients      = debug('webprogress:clients'),
        
        CWD             = process.cwd(),
        Socket,
        Clients         = [],
        ConNum          = -1;
    
    module.exports = function(options) {
        var o       = options || {},
            prefix  = o.prefix || '/webprogress';
        
        if (o.socket)
            Socket = o.socket;
        else if (o.server)
            Socket = io.listen(o.server);
        else
            throw(Error('server or socket should be passed in options!'));
        
        Socket
            .of(prefix)
            .on('connection', onConnection.bind(null, options));
    };
    
    function onConnection(options, socket) {
        var msg, onDisconnect, onMessage,
            execute     = options.execute,
            indexEmpty  = Clients.indexOf(null),
            ERROR_MSG   = 'could not be empty!';
        
        if (!socket)
            throw(Error('socket ' + ERROR_MSG));
        
        logClients('add before:', Clients);
        
        if (indexEmpty >= 0)
            ConNum = indexEmpty;
        else
            ConNum = Clients.length;
        
        msg = log(ConNum + 1, 'webprogress connected\n');
        
        socket.emit('data', msg);
        
        socket.emit('path', options.prompt || CWD);
        socket.emit('prompt');
        
        Clients[ConNum] = {
            cwd : CWD
        };
        
        logClients('add after:', Clients);
        
        onMessage                   = function() {
            execute(socket);
        };
        
        onDisconnect                = function(conNum) {
            logClients('remove before:', Clients);
            
            if (Clients.length !== conNum + 1) {
                Clients[conNum] = null;
            } else {
                Clients.pop();
                --ConNum;
            }
            
            logClients('remove after:', Clients);
            
            log(conNum, 'webprogress disconnected');
            
            socket.removeListener('command', onMessage);
            socket.removeListener('disconnect', onDisconnect);
        }.bind(null, ConNum);
        
        socket.on('command', onMessage);
        socket.on('disconnect', onDisconnect);
    }
    
    function log(connNum, str, typeParam) {
        var ret, 
            type       = ' ';
        
        if (str) {
            
            if (typeParam)
                type  += typeParam + ':';
            
            ret        = 'client #' + connNum + type + str;
        }
        
        logConsole(ret);
        
        return ret;
    }
})();
