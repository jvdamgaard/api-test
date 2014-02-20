module.exports = function(user, method, ressourceName) {

    // Unauthorized for specific ressource and method
    if (user.ressources[ressourceName] && user.ressources[ressourceName][method] === false) {
        return false;
    }
    if (user.ressources.general[method] === false) {
        return false;
    }
    return true;
};
