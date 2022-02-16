let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../bin/www");
let should = chai.should();

chai.use(chaiHttp);

describe("index Route /", () => {
    it("it should display the index html page", (done) => {
        chai.request(server)
            .get("/")
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                done();
            })
    })
});

describe("Post /register in users", () => {
    it("it should ask for the remaining fields", (done) => {
        let details = {
            firstname: "Korede",
            lastname: "Egbeolowo",

        }
        chai.request(server)
            .post("/users/register")
            .send(details)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("All input fields are required")
                done();
            })
    })
});

describe("Post /register in users", () => {
    it("it should create a new User", (done) => {
        let details = {
            firstname: "Korede",
            lastname: "Egbeolowo",
            email: "risetest@gmail.com",
            phone: "08115850688",
            password: "korede__"

        }
        chai.request(server)
            .post("/users/register")
            .send(details)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("token");
                done();
            })
    })
});

describe("Post /register in users", () => {
    it("it should return an error that email already exists", (done) => {
        let details = {
            firstname: "Korede",
            lastname: "Egbeolowo",
            email: "risetest@gmail.com",
            phone: "08115850688",
            password: "korede__"

        }
        chai.request(server)
            .post("/users/register")
            .send(details)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("User Already Exist")
                done();
            })
    })
});

describe("Login /login in users", () => {
    it("it should not login the User because some fields are empty", (done) => {
        let details = {
            email: "risetest@gmail.com",
        }
        chai.request(server)
            .post("/users/login")
            .send(details)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("All input is required")
                done();
            })
    })
});

describe("Login /login in users", () => {
    it("it should not login the User because of a wrong password", (done) => {
        let details = {
            email: "risetest@gmail.com",
            password: "korede_____66"
        }
        chai.request(server)
            .post("/users/login")
            .send(details)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("Wrong Password")
                done();
            })
    })
});

describe("Login /login in users", () => {
    it("it should not login the User because of a wrong email", (done) => {
        let details = {
            email: "risetestingere@gmail.com",
            password: "korede__"
        }
        chai.request(server)
            .post("/users/login")
            .send(details)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("Invalid email")
                done();
            })
    })
});

describe("Login /login in a user", () => {
    it("it should login the user", (done) => {
        let details = {
            email: "risetest@gmail.com",
            password: "korede__"

        }
        chai.request(server)
            .post("/users/login")
            .send(details)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("token");
                done();
            })
    })
});

describe("User index Route /", () => {
    it("it should display the User Route", (done) => {
        chai.request(server)
            .get("/users")
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                done();
            })
    })
});

