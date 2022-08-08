// Declare the function Auth Challenger that takes in one parameter, the users

const AuthChallenger = function(knex){
    return function (username, password, cb){
        let query = knex 
        .select("username")
        .from("users")
        .where("username", username)
        .where("password", password);

        query
        .then ((rows) => {
            if(rows.length === 1) {
                cb (null, true);
            }else{
                cb(null, false);
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    };
};
// This code exports the function we hae just defined.
module.exports = AuthChallenger;
