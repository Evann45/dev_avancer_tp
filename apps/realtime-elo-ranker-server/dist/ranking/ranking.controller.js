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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingController = void 0;
const common_1 = require("@nestjs/common");
const ranking_service_1 = require("./ranking.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let RankingController = class RankingController {
    constructor(rankingService, eventEmitter) {
        this.rankingService = rankingService;
        this.eventEmitter = eventEmitter;
    }
    getRanking() {
        return this.rankingService.getRanking();
    }
    sse() {
        const playerCreated = (0, rxjs_1.fromEvent)(this.eventEmitter, 'player.created').pipe((0, operators_1.map)((event) => {
            return {
                data: {
                    type: 'RankingUpdate',
                    player: event.player,
                }
            };
        }));
        const matchResult = (0, rxjs_1.fromEvent)(this.eventEmitter, 'match.result').pipe((0, operators_1.map)((event) => {
            return {
                data: {
                    type: 'RankingUpdate',
                    player: event.player,
                }
            };
        }));
        return (0, rxjs_1.merge)(matchResult, playerCreated);
    }
};
exports.RankingController = RankingController;
__decorate([
    (0, common_1.Get)("ranking"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Sse)('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], RankingController.prototype, "sse", null);
exports.RankingController = RankingController = __decorate([
    (0, common_1.Controller)('api/ranking'),
    __metadata("design:paramtypes", [ranking_service_1.RankingService,
        event_emitter_1.EventEmitter2])
], RankingController);
//# sourceMappingURL=ranking.controller.js.map