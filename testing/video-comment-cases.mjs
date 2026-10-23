// Labels are assigned before evaluation; these are fixed synthetic comments, not recorded model outputs.
export const videoCommentCases = [
  {id:'V-E01',text:'这个门自己关上了，有点不对劲。',requiresExpression:true,acceptedEmojis:['😟','🤨','😨'],forbiddenEmojis:['😊','😂','🥳']},
  {id:'V-E02',text:'他为了救人受了伤，真让人揪心。',requiresExpression:true,acceptedEmojis:['😟','😢','🫂'],forbiddenEmojis:['😊','😂','🥳']},
  {id:'V-E03',text:'她为了保险从外面锁上门，这气氛太压抑了。',requiresExpression:true,acceptedEmojis:['😟','😨','😢'],forbiddenEmojis:['😊','😂','🥳']},
  {id:'V-E04',text:'原来钥匙一直在他手里，真没想到。',requiresExpression:true,acceptedEmojis:['😮','😲'],forbiddenEmojis:['😂','🥳']},
  {id:'V-E05',text:'突然冒出来那一下，真把我吓到了。',requiresExpression:true,acceptedEmojis:['😨','😱'],forbiddenEmojis:['😊','😂','🥳']},
  {id:'V-E06',text:'这个无伤大雅的乌龙太好笑了。',requiresExpression:true,acceptedEmojis:['😂','😄'],forbiddenEmojis:['😠','😡']},
  {id:'V-E07',text:'刚才还很担心，现在大家平安出来，总算放心了。',requiresExpression:true,acceptedEmojis:['😌','🙂','😊'],forbiddenEmojis:['😱','😡']},
  {id:'V-E08',text:'他嘴上说“我很开心”，可这段离别看得我很难过。',requiresExpression:true,acceptedEmojis:['😢','😞','🫂'],forbiddenEmojis:['😊','😂','🥳']},
  {id:'V-N01',text:'他把相机交给队友了。',requiresExpression:false},
  {id:'V-N02',text:'这一段没有对白，画面现在是黑的。',requiresExpression:false},
  {id:'V-N03',text:'字幕写着“我很开心”，这是角色说的话。',requiresExpression:false},
  {id:'V-N04',text:'镜头里的人正在流泪，随后画面切到了门口。',requiresExpression:false},
];
