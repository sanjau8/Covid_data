const axios=require('axios')
const cheerio=require('cheerio')


var express = require('express')
var app = express()

app.get('/',function(req,resp){
    resp.end('Hey Success' )
})


app.get('/car',function(req,resp){
    temp={'action':'L}
    res.end(JSON.stringify(temp))
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



app.get("/get_country",function(req,res){
    const wurl='https://www.worldometers.info/coronavirus/'
    axios.get(wurl).then(function(resp){
        var ans=[]
        const filt=cheerio.load(resp.data)
        
        var cntname=req.query['name']
        cntname=cntname.toLowerCase()
        cntname=cntname.replace(/ /g, "")
        console.log(cntname)
        var names=[]
        var ck=0
        
        cont=filt('th','#main_table_countries_today').map(function(){
            if(ck==1){
            aa=filt(this).text()
            aa=aa.replace(/(\r\n|\n|\r)/gm,"");
            aa=aa.replace('/',' per ')
            aa=aa.replace(',','/')
            aa=aa.replace(/ /g, "")
            aa=aa.replace(/\W/g, '')
            names.push(aa)
            }
            ck=1

        })

        var nn=7
        var cnt=0
        console.log(names)
        cont=filt('#main_table_countries_today > tbody > tr').map(function(){
            aa=filt(this).text().split('\n')
            
            cnt+=1
            if(cnt>nn){

               
                var temp={}
                var ii=2
                proc=aa[ii].toLowerCase()
                proc=proc.replace(/ /g, "")
                if(proc==cntname){
                while(ii<11){
                    tmpp=aa[ii].trim()
                    
                    temp[names[ii-2]]=tmpp
                    ii+=1
                }
                tmpp=aa[ii+1].trim()
                
                temp[names[ii-1]]=tmpp
                
                    
            
                res.end(JSON.stringify(temp))
            }
            
            }
        })
        
        


        
        
        
        


        
        
    })

    

})


app.listen(process. env. PORT || 3000);
