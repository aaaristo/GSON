var traverse   = require('circularjs');

exports.encode= function (orig,skipDelete)
{
    var known= [], nodes= [], keyss= [];

    if (traverse.isNode(orig))
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

           if (keys)
             keys.forEach(function (key)
             {
                var val= node[key];

                if (val&&traverse.isNode(val))
                  o[key]= { _: val.__visited };
                else
                  o[key]= val;
             });
           else
             node.forEach(function (val,key)
             {
                if (val&&traverse.isNode(val))
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

exports.decode= function (encoded,eachNode)
{
  if (Array.isArray(encoded))
  {
      var fn= function (node,idx)
      {
           if (Array.isArray(node))
             node.forEach(function (val,key)
             {
                if (val&&traverse.isNode(val))
                  node[key]= encoded[val._];
             });
           else
             Object.keys(node).forEach(function (key)
             {
                var val= node[key];

                if (val&&traverse.isNode(val))
                  node[key]= encoded[val._];
             });
      };

      if (eachNode)
        fn= (function (fn)
            {
               return function (node,idx)
               {
                    eachNode(node);
                    fn(node,idx);
               };
            })(fn); 

      encoded.forEach(fn);

      return encoded[0];
  } 
  else
    return encoded;
};

exports.stringify= function (orig)
{
   return JSON.stringify(exports.encode(orig));
};

exports.parse= function (s,eachNode)
{
   return exports.decode(JSON.parse(s),eachNode);
};
