module.exports = function(app) {
    var MongoDB = app.dataSources.MongoDB;

    MongoDB.automigrate('Customer', function(err) {
        if (err) throw (err);
        var Customer = app.models.Customer;

        Customer.create([{
            username: 'Admin',
            email: 'admin@admin.com',
            password: 'abcdef'
        }, {
            username: 'muppala',
            email: 'muppala@ust.hk',
            password: 'abcdef'
        }], function(err, users) {
            if (err) throw (err);
            var Role = app.models.Role;
            var RoleMapping = app.models.RoleMapping;

            Role.find({
                name: 'admin'
            }, function(err, results) {
                if (err) { /* handle this! */ 
                    throw (err);
                }
                
                if (results.length < 1) {
                    // now we know the DB doesn't have it already, so do the Role creation...
                    //create the admin role
                    Role.create({
                        name: 'admin'
                    }, function(err, role) {
                        if (err) throw (err);
                        //make admin
                        role.principals.create({
                            principalType: RoleMapping.USER,
                            principalId: users[0].id
                        }, function(err, principal) {
                            if (err) throw (err);
                        });
                    });
                }
            });

        });
    });

};
