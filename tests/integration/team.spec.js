require('dotenv').config();

const chai     = require('chai');
const chaiHttp = require('chai-http');
const teamsMysqlRepository = require('../../src/repository/mysql/team-repository');
const models   = require('../../src/models/index');
const server   = require('../../devServer');

const should   = chai.should();
const assert   = chai.assert;

chai.use(chaiHttp);

const newCompany = {
    name: 'Chelsea',
    logo: 'http://lorempixel.com/640/480/sports',
    isActive: 0,
};

describe('Team', () => {
    before(async () => {
        await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await models.Team.sync({ force: true });
        await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    });
    describe('POST /teams', () => {
        it('should create a Team record and return its link', (done) => {
            chai.request(server)
                .post('/teams')
                .set('Authorization', process.env.TEST_TOKEN)
                .set('content-type', 'application/json')
                .send(newCompany)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.should.have.header('content-location');
                    teamsMysqlRepository
                        .getTeamById({ teamId: 1 })
                        .then((team) => {
                            team.should.be.an('object');
                            done();
                        });
                });
        });
    });
    describe('PUT /teams/:id', () => {
        it('should replace a Team record with a new one', (done) => {
            chai.request(server)
                .put('/teams/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .set('content-type', 'application/json')
                .send({ isActive: 1 })
                .end((err, res) => {
                    res.should.have.status(204);
                    teamsMysqlRepository
                        .getTeamById({ teamId: 1 })
                        .then((team) => {
                            assert.equal(team.is_active, 1);
                            done();
                        });
                });
        });
    });
    describe('GET /teams', () => {
        it('should return an array of Team objects', done => {
            chai.request(server)
                .get('/teams')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);
                    res.body[0].should.be.an('object');
                    done();
                });
        });
        it('should return an array of Team objects with fields: name, telephone', done => {
            chai.request(server)
                .get('/teams?fields=id,name')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.be.an('object').that.has.all.keys('id', 'name');
                    done();
                });
        });
        it('should return 400 when the requested fields are wrong', done => {
            chai.request(server)
                .get('/teams?fields=name,doesNotExist')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
    describe('GET /teams/:id', () => {
        it('should return a Team object', (done) => {
            chai.request(server)
                .get('/teams/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });
        it('should return a Team object with fields: id, address.street, address.number', (done) => {
            chai.request(server)
                .get('/teams/1?fields=id,name')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object').that.has.all.keys('id', 'name');
                    done();
                });
        });
        it('should return 400 when the requested fields are wrong', (done) => {
            chai.request(server)
                .get('/teams/1?fields=name,doesNotExist')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
    describe('DELETE /teams/:id', () => {
        it('should delete a Team record', (done) => {
            chai.request(server)
                .delete('/teams/1')
                .set('Authorization', process.env.TEST_TOKEN)
                .end((err, res) => {
                    res.should.have.status(204);
                    teamsMysqlRepository
                        .getTeamById({ teamId: 1 })
                        .then((team) => {
                            assert.equal(team, null);
                            done();
                        });
                });
        });
    });
});
