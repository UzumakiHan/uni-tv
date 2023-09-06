export interface IChannelFile{
    name:string;
    size:number;
    type:string;
    url:string
}
export interface IChannel{
    channel_file:Array<IChannelFile>;
    channel_icon:Array<string>;
    channel_name:string;
    channel_source:string;
    channel_id:string;
    classify:string;
    epg:string;
    sort:string;
    player:string;
    state:string;
    _archived:boolean;
    _creator:string;
    _ctime:string;
    channelpv:number;
    channeluv:number;
    _id:string;
    _last_modifier:string;
    _locked:boolean;
    _locked_by:string;
    _mtime:string;
    num_of_col:string;
    fixMode?:string
    channel_icon_url?:string
    
}
export interface IChannelList extends IChannel{
    channel_icon_url:string;
    channel_file_url:string;
   
}

export interface IDownLinkRes{
    download_link:string
}
export interface ISource{
    radio:string;
    url:string
}
export interface ITabList{
    name:string;
    childrens:Array<IChannel>
}
export interface IClassifyList{
    name:string;
    childrens:Array<IChannelList>
}
export interface IClassify{
    classify:string;
    sort:string;
    _ctime:string;
    _id:string;
    _mtime:string;
}
export interface IFormatChannel{
    channel_icon_url:string;
    channel_id:string;
    channel_name:string;
    fixMode?:string
}
export interface IPlayList {
    start_date: string;
    title: string;
    isPlay: boolean;
    timeNum?: string;

}