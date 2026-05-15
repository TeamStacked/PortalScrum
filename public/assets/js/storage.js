(function () {
    var MODULES_KEY = "scrum-modulos";
    var USER_KEY = "scrum-user";
    var USERS_KEY = "scrum-users";
    var THEME_KEY = "scrum-theme";
    var RESULT_KEY = "scrum-last-result";
    var initialModules = [
        {
            id: 1,
            nome: "Fundamentos do Scrum",
            descricao: "Introducao aos conceitos basicos",
            tentativas: 2,
            tentativasUsadas: 0,
            status: "disponivel",
            nota: null,
        },
        {
            id: 2,
            nome: "Papeis do Scrum",
            descricao: "Scrum Master, Product Owner e Time",
            tentativas: 2,
            tentativasUsadas: 0,
            status: "bloqueado",
            nota: null,
        },
        {
            id: 3,
            nome: "Eventos do Scrum",
            descricao: "Sprints, Daily, Review e Retrospectiva",
            tentativas: 2,
            tentativasUsadas: 0,
            status: "bloqueado",
            nota: null,
        },
        {
            id: 4,
            nome: "Artefatos do Scrum",
            descricao: "Product Backlog e Sprint Backlog",
            tentativas: 2,
            tentativasUsadas: 0,
            status: "bloqueado",
            nota: null,
        },
        {
            id: 5,
            nome: "Certificacao Final",
            descricao: "Prova completa de certificacao",
            tentativas: 2,
            tentativasUsadas: 0,
            status: "bloqueado",
            nota: null,
        },
    ];
    function read(key, fallback) {
        try {
            var value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }
    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
    function getModules() {
        var saved = read(MODULES_KEY, null);
        if (Array.isArray(saved) && saved.length) return saved;
        saveModules(initialModules);
        return initialModules.map(function (item) {
            return Object.assign({}, item);
        });
    }
    function saveModules(modules) {
        return write(MODULES_KEY, modules);
    }
    function getCurrentUser() {
        return read(USER_KEY, null);
    }
    function requireAuth() {
        var user = getCurrentUser();
        if (!user) window.location.href = "login.html";
        return user;
    } 
    function login(email, password) {
        var users = read(USERS_KEY, []);
        var found = users.find(function (user) {
            return user.email === email && user.password === password;
        });
        if (!found) return false;
        write(USER_KEY, {
            name: found.name,
            email: found.email,
            profilePhoto: found.profilePhoto || "",
        });
        return true;
    }
    function register(name, email, password) {
        var users = read(USERS_KEY, []);
        if (
            users.some(function (user) {
                return user.email === email;
            })
        )
            return false;
        users.push({
            name: name,
            email: email,
            password: password,
            profilePhoto: "",
        });
        write(USERS_KEY, users);
        write(USER_KEY, { name: name, email: email, profilePhoto: "" });
        return true;
    }
    function logout() {
        localStorage.removeItem(USER_KEY);
    }
    function updateProfile(
        name,
        email,
        profilePhoto,
        currentPassword,
        newPassword,
    ) {
        var currentUser = getCurrentUser();
        if (!currentUser) return false;
        var users = read(USERS_KEY, []);
        var index = users.findIndex(function (user) {
            return user.email === currentUser.email;
        });
        if (index < 0) return false;
        if (
            email !== currentUser.email &&
            users.some(function (user, i) {
                return user.email === email && i !== index;
            })
        )
            return false;
        if (currentPassword || newPassword) {
            if (users[index].password !== currentPassword) return false;
            users[index].password = newPassword;
        }
        users[index].name = name;
        users[index].email = email;
        users[index].profilePhoto = profilePhoto;
        write(USERS_KEY, users);
        write(USER_KEY, {
            name: name,
            email: email,
            profilePhoto: profilePhoto,
        });
        return true;
    }
    window.ScrumStore = {
        getModules: getModules,
        saveModules: saveModules,
        getCurrentUser: getCurrentUser,
        requireAuth: requireAuth,
        login: login,
        register: register,
        logout: logout,
        updateProfile: updateProfile,
        saveResult: function (result) {
            return write(RESULT_KEY, result);
        },
        getResult: function () {
            return read(RESULT_KEY, {
                nota: 85,
                acertos: 17,
                total: 20,
                moduloId: 1,
            });
        },
        getTheme: function () {
            return localStorage.getItem(THEME_KEY) || "dark";
        },
        setTheme: function (theme) {
            localStorage.setItem(THEME_KEY, theme);
            document.documentElement.dataset.theme = theme;
        },
    };
})();
