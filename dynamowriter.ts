import {DynamoDBClient, CreateTableInput, CreateTableCommand, BatchWriteItemCommand} from "@aws-sdk/client-dynamodb";
import {fromIni} from "@aws-sdk/credential-provider-ini"
import DBConn from "./dbconn";
import LvList from "./lvlist";
import SongList from "./songlist";

export default class DynamoWriter {
    db = new DynamoDBClient({
        region: DBConn.aws_region,
        credentials: fromIni({profile: "dbconn"})
    });

    CreateMusic = async () => {
        const table: CreateTableInput = {
            TableName: "piu_songlist",
            KeySchema: [
                { AttributeName: "id", KeyType: "HASH" }
            ],
            AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "N" }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 1, 
                WriteCapacityUnits: 1
            }
        };

        const createCmd = new CreateTableCommand(table);
        await this.db.send(createCmd)
        .then((output) => {
            console.log("Complete", output);
        });
    }

    CreateLv = async () => {
        const table: CreateTableInput = {
            TableName: "piu_lvtable",
            KeySchema: [
                { AttributeName: "id", KeyType: "HASH" }
            ],
            AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "N" }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 1, 
                WriteCapacityUnits: 1
            }
        };

        const createCmd = new CreateTableCommand(table);
        await this.db.send(createCmd)
        .then((output) => {
            console.log("Complete", output);
        });
    }

    InsertMusic = async (params: Array<SongList>) => {
        console.log("SongList Add");
        const size = params.length % 25 == 0 ? params.length / 25 : params.length / 25 + 1;
        for(let i = 0; i < size; i++) {
            // 각 오브젝트마다 나눠서 리스트 통째로 쿼리 만들어서 실행하기
            const music = {
                RequestItems: {
                    "piu_songlist": [
                        {}
                    ]
                }
            };
            
            let max = 25;
            if(i == size - 1) {
                if(params.length % 25 != 0) {
                    max = params.length % 25;
                }
            }
            let mlist: Object[] = [];

            // 0~25 혹은 마지막 라인인 경우 최대 개수 까지 모으는 루프
            for(let j = 0; j < max; j++) {
                const v = params[25*i+j];
                const item = {
                    PutRequest: {
                        Item: {
                            "id": { "N": v.id.toString() },
                            "title_en": { "S": v.title_en },
                            "title_ko": { "S": v.title_ko },
                            "artist": { "S": v.artist },
                            "removed": { "N": v.removed.toString() },
                            "songtype": { "N": v.songtype.toString() },
                            "version": { "N": v.version.toString() },
                            "new": { "N": v.new.toString() }
                        }
                    }
                }
                mlist.push(item);
            }
            music.RequestItems.piu_songlist = mlist;
            const batchCmd = new BatchWriteItemCommand(music);
            await this.db.send(batchCmd);
        }
    }

    InsertLv = async (params: Array<LvList>) => {
        console.log("LvTable Add");
        const size = params.length % 25 == 0 ? params.length / 25 : params.length / 25 + 1;
        for(let i = 0; i < size; i++) {
            // 각 오브젝트마다 나눠서 리스트 통째로 쿼리 만들어서 실행하기
            const lvtable = {
                RequestItems: {
                    "piu_lvtable": [
                        {}
                    ]
                }
            };

            let max = 25;
            if(i == size - 1) {
                if(params.length % 25 != 0) {
                    max = params.length % 25;
                }
            }
            let llist: Object[] = [];

            // 0~25 혹은 마지막 라인인 경우 최대 개수 까지 모으는 루프
            for(let j = 0; j < max; j++) {
                const v = params[25*i+j];
                const item = {
                    PutRequest: {
                        Item: {
                            "id": { "N": v.id.toString() },
                            "musicid": { "N": v.musicid.toString() },
                            "title": { "S": v.title },
                            "type": { "N": v.type.toString() },
                            "lv": { "N": v.lv.toString() },
                            "difftype": { "N": v.difftype.toString() },
                            "steptype": { "N": v.steptype.toString() },
                            "removed": { "N": v.removed.toString() }
                        }
                    }
                }
                llist.push(item);
            }
            lvtable.RequestItems.piu_lvtable = llist;
            const batchCmd = new BatchWriteItemCommand(lvtable);
            await this.db.send(batchCmd);
        }
    }
}