
module.exports = {
    externals: ['tls', 'net', 'fs',"request"],
    node: {
        net: 'empty',  // webpack error without this, Can't resolve 'net' in './node_modules/ib/lib'
    },
    target:"node"
 }