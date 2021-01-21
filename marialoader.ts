import mariadb from 'mariadb';
import DBConn from './dbconn';
import LvList from './lvlist';
import SongList from './songlist';

export default class MariaLoader {
    db = mariadb.createPool({
        host: DBConn.m_url,
        port: DBConn.m_port,
        user: DBConn.m_user,
        password: DBConn.m_pass,
        connectionLimit: 5
    });

    LoadList = async () => {
        const songlist = new Array<SongList>();
        let query = "use piumanager";
        const con = await this.db.getConnection();
        con.query(query);

        query = `select * from piu_songlist`;
        await con.query(query).then((d) => {
            for(let i = 0; i < d.length; i++) {
                const song = new SongList();
                song.id = d[i].id;
                song.title_en = d[i].title_en;
                song.title_ko = d[i].title_ko;
                song.artist = d[i].artist;
                song.removed = d[i].removed;
                song.version = d[i].version;
                song.songtype = d[i].songtype;
                song.new = d[i].new;

                songlist.push(song);
            }
        });

        return songlist;
    }

    LoadLevel = async () => {
        const lvlist = new Array<LvList>();
        let query = "use piumanager";
        const con = await this.db.getConnection();
        con.query(query);

        query = `select * from piu_lvtable where id >= 1157`;
        await con.query(query).then((d) => {
            for(let i = 0; i < d.length; i++) {
                const lv = new LvList();
                lv.id = d[i].id;
                lv.musicid = d[i].musicid;
                lv.title = d[i].title;
                lv.type = d[i].type;
                lv.lv = d[i].lv;
                lv.difftype = d[i].difftype;
                lv.steptype = d[i].steptype;
                lv.removed = d[i].removed;

                lvlist.push(lv);
            }
        });

        return lvlist
    }
}