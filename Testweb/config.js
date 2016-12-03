require.config({
    baseUrl:'webroot',//相对于configjs
    paths:{      //相对于requirejs
        "a":"../js/jquery-1.12.3.min",
        "b":"../css/bootstrap-3.3.5/js/bootstrap.min",
        "c":"../js/index",
        "d":"../js/test",
    }
    });
require(['a','b','c','d'],function(m,n,q,o){
    m.transfor();
    n.transfor();
    q.transfor();
    o.transfor();
});