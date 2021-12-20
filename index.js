//Dependencies
const Puppeteer_Stealth = require("puppeteer-extra-plugin-stealth")
const Puppeteer = require("puppeteer-extra")
const Is_Email = require("is-email")
const Axios = require("axios")
const Chalk = require("chalk")

//Variables
const Self_Args = process.argv.slice(2)

///Configurations
//Puppeteer
Puppeteer.default.use(Puppeteer_Stealth())

//Functions
async function HaveIBeenPwned(){
    const browser = await Puppeteer.default.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] })
    const page = await browser.newPage()

    await page.goto(`https://haveibeenpwned.com/unifiedsearch/${Self_Args[0]}`, { waitUntil: "domcontentloaded" }).then(async()=>{
        const page_content = await page.content()

        await browser.close()

        if(page_content === "<html><head></head><body></body></html>"){
            await browser.close()

            if(Is_Email(Self_Args[0])){
                console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenPwned") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.greenBright("NOT PWNED") + Chalk.grey("]")} The email is not pwned.`)
                Bing()
            }else{
                console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenPwned") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.greenBright("NOT PWNED") + Chalk.grey("]")} The password is not pwned.`)
                Bing()
            }
            
            return
        }
        
        if(Is_Email(Self_Args[0])){
            console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenPwned") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.redBright("PWNED") + Chalk.grey("]")} The email is pwned.`)
            Bing()
        }else{
            console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenPwned") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.redBright("PWNED") + Chalk.grey("]")} The password is pwned.`)
            Bing()
        }
    }).catch(async()=>{
        await browser.close()

        if(Is_Email(Self_Args[0])){
            console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenPwned") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.greenBright("NOT PWNED") + Chalk.grey("]")} The email is not pwned.`)
            Bing()
            return
        }else{
            console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenPwned") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.greenBright("NOT PWNED") + Chalk.grey("]")} The password is not pwned.`)
            Bing()
            return
        }
    })
}

async function Bing(){
    try{
        var response = await Axios({
            method: "GET",
            url: `https://www.bing.com/search?q=${Self_Args[0]}`,
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36"
            }
        })

        response = response.data

        if(response.indexOf("no results") === -1){
            if(Is_Email(Self_Args[0])){
                console.log(`${Chalk.grey("[") + Chalk.cyanBright("Bing") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.redBright("CAN BE PWN") + Chalk.grey("]")} The email is pwned.`)
                HaveIBeenSold()
                return
            }else{
                console.log(`${Chalk.grey("[") + Chalk.cyanBright("Bing") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.redBright("CAN BE PWN") + Chalk.grey("]")} The password is pwned.`)
                HaveIBeenSold()
                return
            }
        }else{
            if(Is_Email(Self_Args[0])){
                console.log(`${Chalk.grey("[") + Chalk.cyanBright("Bing") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.greenBright("NOT PWNED") + Chalk.grey("]")} The email is not pwned.`)
                HaveIBeenSold()
                return
            }else{
                console.log(`${Chalk.grey("[") + Chalk.cyanBright("Bing") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.greenBright("NOT PWNED") + Chalk.grey("]")} The password is not pwned.`)
                HaveIBeenSold()
                return
            }
        }
    }catch{
        console.log(`${Chalk.grey("[") + Chalk.cyanBright("Bing") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.yellowBright("Unknown") + Chalk.grey("]")} Something went wrong while requesting, skipping Bing.`)
        HaveIBeenSold()
        return
    }
}

async function HaveIBeenSold(){
    if(Is_Email(Self_Args[0])){
        try{
            var response = await Axios({
                method: "POST",
                url: "https://haveibeensold.app/api/api.php",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                data: `email=${Self_Args[0]}&action=check`
            })

            response = response.data

            if(response.data.length){
                console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenSold") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.redBright("PWNED") + Chalk.grey("]")} The email is pwned.`)
                SpyCloud()
                return
            }else{
                console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenSold") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.greenBright("NOT PWNED") + Chalk.grey("]")} The email is not pwned.`)
                SpyCloud()
                return
            }
        }catch{
            console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenSold") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.yellowBright("Unknown") + Chalk.grey("]")} Something went wrong while requesting, skipping Bing.`)
            SpyCloud()
            return
        }
    }else{
        console.log(`${Chalk.grey("[") + Chalk.cyanBright("HaveIBeenSold") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.yellowBright("Unknown") + Chalk.grey("]")} HaveIBeenSold is for email only, Skipping HaveIBeenSold.`)
        SpyCloud()
        return
    }
}

async function SpyCloud(){
    if(Is_Email(Self_Args[0])){
        const browser = await Puppeteer.default.launch({ headless: false, args: ["--no-sandbox", "--disable-setuid-sandbox"] })
        const page = await browser.newPage()
    
        await page.goto(`https://spycloud.com/check-your-exposure/?email=${Self_Args[0]}`, { waitUntil: "networkidle0" }).catch(async()=>{
            await browser.close()

            console.log(`${Chalk.grey("[") + Chalk.cyanBright("SpyCloud") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.yellowBright("Unknown") + Chalk.grey("]")} SpyCloud is for email only, Skipping SpyCloud.`)
            Done()
            return
        })

        const pwn_value = await page.$eval("div.elementor-element.elementor-element-0665eb6.elementor-widget.elementor-widget-text-editor > div > div > h3", elem => elem.textContent)

        if(pwn_value !== "0"){
            console.log(`${Chalk.grey("[") + Chalk.cyanBright("SpyCloud") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.redBright("PWNED") + Chalk.grey("]")} The email is pwned.`)
            Done()
            return
        }else{
            console.log(`${Chalk.grey("[") + Chalk.cyanBright("SpyCloud") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.greenBright("NOT PWNED") + Chalk.grey("]")} The email is not pwned.`)
            Done()
            return
        }
    }else{
        console.log(`${Chalk.grey("[") + Chalk.cyanBright("SpyCloud") + Chalk.grey("]")}${Chalk.grey("[") + Chalk.yellowBright("Unknown") + Chalk.grey("]")} SpyCloud is for email only, Skipping SpyCloud.`)
        Done()
        return
    }
}

function Done(){
    console.log(`${Chalk.grey("[") + Chalk.blueBright("INFO") + Chalk.grey("]")} Finished checking.`)
    process.exit()
}

//Main
if(!Self_Args.length){
    console.log("node index.js <email/password>")
    process.exit()
}

console.log(`${Chalk.grey("[") + Chalk.blueBright("INFO") + Chalk.grey("]")} Checking has started.`)
HaveIBeenPwned()