"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const match_entity_1 = require("./entities/match.entity");
const player_service_1 = require("../player/player.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let MatchService = class MatchService {
    constructor(matchRepository, playerService, eventEmitter) {
        this.matchRepository = matchRepository;
        this.playerService = playerService;
        this.eventEmitter = eventEmitter;
    }
    findAll() {
        return this.matchRepository.find();
    }
    createMatch(match, callback) {
        this.playerService.findOne(match.winner, (err, winner) => {
            if (err || !winner) {
                return callback(new Error('Winner not found'), null);
            }
            this.playerService.findOne(match.loser, (err, loser) => {
                if (err || !loser) {
                    return callback(new Error('Loser not found'), null);
                }
                this.updateRank(match.winner, match.loser, (err) => {
                    if (err) {
                        return callback(err, null);
                    }
                    this.eventEmitter.emit('match.result', {
                        player: {
                            id: winner.id,
                            rank: winner.rank,
                        },
                    });
                    this.eventEmitter.emit('match.result', {
                        player: {
                            id: loser.id,
                            rank: loser.rank,
                        },
                    });
                    this.matchRepository.save(match).then(newMatch => {
                        callback(null, newMatch);
                    }).catch(err => callback(err, null));
                });
            });
        });
    }
    findOne(id, callback) {
        this.matchRepository.findOneBy({ id }).then(match => {
            if (!match) {
                return callback(new Error(`Match with id ${id} not found`), null);
            }
            callback(null, match);
        }).catch(err => callback(err, null));
    }
    calculateElo(winner, loser, callback) {
        this.playerService.findOne(winner, (err, winnerData) => {
            if (err || !winnerData) {
                return callback(new Error('Winner not found'), null);
            }
            this.playerService.findOne(loser, (err, loserData) => {
                if (err || !loserData) {
                    return callback(new Error('Loser not found'), null);
                }
                const expectedScore = 1 / (1 + Math.pow(10, (loserData.rank - winnerData.rank) / 400));
                callback(null, expectedScore);
            });
        });
    }
    updateRank(winner, loser, callback) {
        const k = 32;
        this.playerService.findOne(winner, (err, winnerData) => {
            if (err || !winnerData) {
                return callback(new Error('Winner not found'));
            }
            this.playerService.findOne(loser, (err, loserData) => {
                if (err || !loserData) {
                    return callback(new Error('Loser not found'));
                }
                this.calculateElo(winner, loser, (err, expectedScore) => {
                    if (err || expectedScore === null) {
                        return callback(err);
                    }
                    const winnerNewRank = winnerData.rank + k * (1 - expectedScore);
                    const loserNewRank = loserData.rank + k * (0 - expectedScore);
                    this.playerService.updateRank(winner, winnerNewRank, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        this.playerService.updateRank(loser, loserNewRank, (err) => {
                            if (err) {
                                return callback(err);
                            }
                            callback(null);
                        });
                    });
                });
            });
        });
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        player_service_1.PlayerService,
        event_emitter_1.EventEmitter2])
], MatchService);
//# sourceMappingURL=match.service.js.map