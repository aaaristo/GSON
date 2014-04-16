var traverse   = require('circularjs');

exports.encode= function (orig,skipDelete)
{
    var _root, known= [], nodes= [], keyss= [];

    if (typeof orig=='object')
    {
        // structure
        traverse(orig,
        function (node,keys)
        {
           var x= known[node.__visited]= Array.isArray(node) ? [] : {};
           nodes.push(node);
           keyss.push(keys);
        },true);

        // values
        nodes.forEach(function (node,idx)
        {
           var o= known[node.__visited], keys= keyss[idx];

           if (!_root) _root= node.__visited;

           if (keys)
             keys.forEach(function (key)
             {
                var val= node[key];

                if (val&&typeof val=='object')
                  o[key]= { _: val.__visited };
                else
                  o[key]= val;
             });
           else
             node.forEach(function (val,key)
             {
                if (val&&typeof val=='object')
                  o[key]= { _: val.__visited };
                else
                  o[key]= val;
             });
        });

        if (!skipDelete)
          nodes.forEach(function (node) { delete node.__visited; });

        return known;
    }
    else
        return orig;

};

exports.decode= function (encoded)
{
  if (Array.isArray(encoded))
  {
      encoded.forEach(function (node,idx)
      {
           if (Array.isArray(node))
             node.forEach(function (val,key)
             {
                if (val&&typeof val=='object')
                  node[key]= encoded[val._];
             });
           else
             Object.keys(node).forEach(function (key)
             {
                var val= node[key];

                if (val&&typeof val=='object')
                  node[key]= encoded[val._];
             });
      });

      return encoded[0];
  } 
  else
    return encoded;
};

exports.stringify= function (orig)
{
   return JSON.stringify(exports.encode(orig));
};

exports.parse= function (s)
{
   return exports.decode(JSON.parse(s));
};
