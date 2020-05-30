const axios=require('axios')
const cheerio=require('cheerio')


var express = require('express')
var app = express()

app.get('/',function(req,resp){
    resp.end('Hey Success' )
})
app.get('/get_report',function(req,res){

const url='https://www.mygov.in/covid-19/'

axios.get(url).then(function(resp){
    var send={}
    const filt=cheerio.load(resp.data)
    var cont=filt('div[class=helpline_contact]').html()
    aa=cont.split(',')

    //HELPLINE, MAIL 
    help=aa[0]
    mail=aa[1].slice(17,32)
    send['helpline']=help
    send['mail']=mail
    console.log(help+" "+mail)
    //-----------------

    //INDIA TOTAL
    cont=filt('span','.info_title').html()
    console.log(cont)
    last_update=cont
    send['last_update']=last_update

    cont=filt('.icount','.active-case').html()
    console.log(cont)
    total_active=cont
    send['total_active']=total_active

    cont=filt('.icount','.discharge').html()
    console.log(cont)
    total_recovered=cont
    send['total_recovered']=total_recovered

    cont=filt('.icount','.death_case').html()
    console.log(cont)
    total_death=cont
    send['total_death']=total_death

    cont=filt('.icount','.migared_case').html()
    console.log(cont)
    total_migrated=cont
    send['total_migrated']=total_migrated


    //STATE TOTAL
    var state=[]
    ck=0
    cont=filt('tr','#state-covid-data').map(function(ind,el){
        if(ck==1){
        aa=filt(this).text().split('\n')
        temp={}
        temp['state']=aa[1].trim()
        temp['confirmed']=aa[2].trim()
        temp['active']=aa[3].trim()
        temp['recovered']=aa[4].trim()
        temp['death']=aa[5].trim()
        
        state.push(temp)
        }
        ck=1


        
        

    })
    state_count=state
    
    send['state_wise']=state
    var out=JSON.stringify(send)
    console.log(send)
    res.end(out)



    




}).catch(function(err){
    console.log(err)
})
});


app.post("/get_report",function(req,resp){

    resp.end("POST to get current status in India")
})

app.listen(3000);