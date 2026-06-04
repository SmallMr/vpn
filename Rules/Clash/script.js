//https://www.clashverge.dev/guide/script.html

// 国内DNS服务器
const domesticNameservers = [
  "https://dns.alidns.com/dns-query", // 阿里云公共DNS
  "https://doh.pub/dns-query", // 腾讯DNSPod
  "https://doh.360.cn/dns-query" // 360安全DNS
];
// 国外DNS服务器
const foreignNameservers = [
  "https://1.1.1.1/dns-query", // Cloudflare(主)
  "https://1.0.0.1/dns-query", // Cloudflare(备)
  "https://208.67.222.222/dns-query", // OpenDNS(主)
  "https://208.67.220.220/dns-query", // OpenDNS(备)
  "https://194.242.2.2/dns-query", // Mullvad(主)
  "https://194.242.2.3/dns-query" // Mullvad(备)
];
// DNS配置
const dnsConfig = {
  "enable": true,
  "listen": "0.0.0.0:1053",
  "ipv6": true,
  "use-system-hosts": true,
  "cache-algorithm": "arc",
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
    // 本地主机/设备
    "+.lan",
    "+.local",
    // Windows网络出现小地球图标
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    // QQ快速登录检测失败
    "localhost.ptlogin2.qq.com",
    "localhost.sec.qq.com",
    // 微信快速登录检测失败
    "localhost.work.weixin.qq.com"
  ],
  "default-nameserver": [ "8.8.4.4", "1.1.1.1", "8.8.8.8","223.5.5.5", "119.29.29.29"],
  "nameserver": [...domesticNameservers, ...foreignNameservers],
  "proxy-server-nameserver": [...domesticNameservers, ...foreignNameservers],
  "nameserver-policy": {
    "geosite:private,cn,geolocation-cn": domesticNameservers,
    "geosite:google,youtube,telegram,gfw,geolocation-!cn": foreignNameservers
  }
};

function main(params) {
    const hongKongProxies = getProxiesByRegex(params, /香港|HK|Hong|🇭🇰/);
    const taiwanProxies = getProxiesByRegex(params, /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/);
    const singaporeProxies = getProxiesByRegex(params, /新加坡|狮城|SG|Singapore|🇸🇬/);
    const japanProxies = getProxiesByRegex(params, /日本|JP|Japan|🇯🇵/);
    const americaProxies = getProxiesByRegex(params, /美国|US|United States|America|🇺🇸/);
    const koreaProxies = getProxiesByRegex(params, /韩|韩国|KR|Korea|🇰🇷/);
    const tuerqiProxies = getProxiesByRegex(params, /土|土耳其|🇹🇷|TR/);
    const othersProxies = getProxiesByRegex(params, /^(?!.*(?:香港|HK|Hong|🇭🇰|韩|韩国|KR|Korea|🇰🇷|土|土耳其|🇹🇷|TR|台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼|新加坡|SG|Singapore|狮城|🇸🇬|日本|JP|Japan|🇯🇵|美国|US|States|America|🇺🇸|自动|故障|流量|官网|套餐|机场|订阅|年|月)).*$/);
    const allProxies = getProxiesByRegex(params, /.*/);

    const areaGroupCommonConfig = {
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        interval: 300,
        tolerance: 20,
        lazy: true,
        timeout: 2000
    };

    const HongKong = {
        ...areaGroupCommonConfig,
        name: "香港",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png",
        proxies: hongKongProxies.length > 0 ? hongKongProxies : ["DIRECT"]
    };

    const TaiWan = {
        ...areaGroupCommonConfig,
        name: "台湾",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png",
        proxies: taiwanProxies.length > 0 ? taiwanProxies : ["DIRECT"]
    };

    const Singapore = {
        ...areaGroupCommonConfig,
        name: "新加坡",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png",
        proxies: singaporeProxies.length > 0 ? singaporeProxies : ["DIRECT"]
    };

    const Japan = {
        ...areaGroupCommonConfig,
        name: "日本",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png",
        proxies: japanProxies.length > 0 ? japanProxies : ["DIRECT"]
    };

    const America = {
        ...areaGroupCommonConfig,
        name: "美国",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png",
        proxies: americaProxies.length > 0 ? americaProxies : ["DIRECT"]
    };

    const Korea = {
        ...areaGroupCommonConfig,
        name: "韩国",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Korea.png",
        proxies: koreaProxies.length > 0 ? koreaProxies : ["DIRECT"]
    };

    const Tuerqi = {
        ...areaGroupCommonConfig,
        name: "土耳其",
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Turkey.png",
        proxies: tuerqiProxies.length > 0 ? tuerqiProxies : ["DIRECT"]
    };

    const Others = {
        ...areaGroupCommonConfig,
        name: "其他地区",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/World_Map.png",
        proxies: othersProxies.length > 0 ? othersProxies : ["DIRECT"]
    };

    const Auto = {
        name: "自动选择",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: allProxies.length > 0 ? allProxies : ["DIRECT"]
    };

    const SelectGroup = {
        name: "节点选择",
        type: "select",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: ["DIRECT", "自动选择", "香港", "台湾", "新加坡", "日本", "美国", "韩国", "土耳其", "其他地区"]
    };

    const SelectSingle = {
        name: "手动切换",
        type: "select",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: allProxies.length > 0 ? allProxies : ["DIRECT"]
    };

    const G = ["香港", "台湾", "新加坡", "日本", "美国", "韩国", "土耳其", "其他地区"];
    const DG = ["DIRECT", "香港", "台湾", "新加坡", "日本", "美国", "韩国", "土耳其", "其他地区"];
    const SDG = ["DIRECT", "节点选择", "自动选择", "香港", "台湾", "新加坡", "日本", "美国", "韩国", "土耳其", "其他地区"];

    const Final = { name: "漏网之鱼", type: "select", proxies: SDG, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png" };
    const YouTube = { name: "YouTube", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png" };
    const Netflix = { name: "Netflix", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netflix.png" };
    const Spotify = { name: "Spotify", type: "select", proxies: DG, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Spotify.png" };
    const ChatGPT = { name: "ChatGPT", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Copilot.png" };
    const Google = { name: "Google", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png" };
    const Telegram = { name: "Telegram", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png" };
    const Disney = { name: "Disney+", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Disney.png" };
    const GitHub = { name: "GitHub", type: "select", proxies: G, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/GitHub.png" };
    const Global = { name: "全球直连", type: "select", proxies: ["DIRECT", "手动切换", "节点选择", "自动选择"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png" };

    const groups = [];
    groups.unshift(HongKong, TaiWan, Japan, Singapore, America, Korea, Tuerqi, Others);
    groups.unshift(SelectSingle, SelectGroup, Auto, Final, Google, YouTube, Netflix, Spotify, ChatGPT, Telegram, Disney, GitHub, Global);

    //规则
    const rules = [
        //Postman
        "DOMAIN,api.getpostman.com,DIRECT",
        "DOMAIN,sync.getpostman.com,DIRECT",
        "DOMAIN,postman.com,DIRECT",
        "DOMAIN,www.postman.com,DIRECT",

        //Nuget
        "DOMAIN,api.nuget.org,DIRECT",
        "DOMAIN,www.nuget.org,DIRECT",
        "DOMAIN,nuget.org,DIRECT",
        "DOMAIN,azuresearch-usnc.nuget.org,DIRECT",
        "DOMAIN,azuresearch-ussc.nuget.org,DIRECT",
        "DOMAIN,azuresearch-ea.nuget.org,DIRECT",
        "DOMAIN,azuresearch-sea.nuget.org,DIRECT",
        "DOMAIN,licenses.nuget.org,DIRECT",
        "DOMAIN,nuget.cdn.azure.cn,DIRECT",

        "RULE-SET,LocalAreaNetwork,全球直连",
        "RULE-SET,UnBan,全球直连",
        "RULE-SET,GoogleFCM,Google",
        "RULE-SET,GitHub,GitHub",
        "RULE-SET,GoogleCN,全球直连",
        "RULE-SET,SteamCN,全球直连",
        "RULE-SET,Telegram,Telegram",
        "RULE-SET,ChatGPT,ChatGPT",
        "RULE-SET,YouTube,YouTube",
        "RULE-SET,Netflix,Netflix",
        "RULE-SET,Spotify,Spotify",
        "RULE-SET,Disney,Disney+",
        "RULE-SET,ProxyGFWlist,节点选择",
        "RULE-SET,ChinaDomain,DIRECT",
        "RULE-SET,ChinaCompanyIp,DIRECT",
        "RULE-SET,Download,DIRECT",
        "GEOIP,CN,DIRECT",
        "MATCH,漏网之鱼"
    ];

    const acl4ssrBaseUrl = "https://raw.githubusercontent.com/SmallMr/vpn/main/Rules/Clash/ACL4SSR/";
    const smallUrl= "https://raw.githubusercontent.com/SmallMr/vpn/main/Rules/";
    const ruleProviders = {
        LocalAreaNetwork: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "LocalAreaNetwork.yaml", path: "./ruleset/LocalAreaNetwork.yaml" },
        UnBan: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "UnBan.yaml", path: "./ruleset/UnBan.yaml" },
        BanAD: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "BanAD.yaml", path: "./ruleset/BanAD.yaml" },
        GoogleFCM: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "GoogleFCM.yaml", path: "./ruleset/GoogleFCM.yaml" },
        GitHub: { type: "http", interval: 86400, behavior: "classical", format: "text", url: smallUrl+"Github.list", path: "./ruleset/GitHub.list" },
        GoogleCN: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "GoogleCN.yaml", path: "./ruleset/GoogleCN.yaml" },
        SteamCN: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "SteamCN.yaml", path: "./ruleset/SteamCN.yaml" },
        Telegram: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "Telegram.yaml", path: "./ruleset/Telegram.yaml" },
        ChatGPT: { type: "http", interval: 86400, behavior: "classical", format: "text", url: smallUrl + "ChatGPT.list", path: "./ruleset/ChatGPT.list" },
        YouTube: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "YouTube.yaml", path: "./ruleset/YouTube.yaml" },
        Netflix: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "Netflix.yaml", path: "./ruleset/Netflix.yaml" },
        Spotify: { type: "http", interval: 86400, behavior: "classical", format: "text", url: smallUrl + "Spotify.list", path: "./ruleset/Spotify.list" },
        Disney: { type: "http", interval: 86400, behavior: "classical", format: "text", url: smallUrl + "Disney.list", path: "./ruleset/Disney.list" },
        ProxyGFWlist: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "ProxyGFWlist.yaml", path: "./ruleset/ProxyGFWlist.yaml" },
        ChinaDomain: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "ChinaDomain.yaml", path: "./ruleset/ChinaDomain.yaml" },
        ChinaCompanyIp: { type: "http", interval: 86400, behavior: "ipcidr", url: acl4ssrBaseUrl + "ChinaCompanyIp.yaml", path: "./ruleset/ChinaCompanyIp.yaml" },
        Download: { type: "http", interval: 86400, behavior: "classical", url: acl4ssrBaseUrl + "Download.yaml", path: "./ruleset/Download.yaml" },
    };

    params.rules = rules;
    params["dns"] = dnsConfig;
    params["proxy-groups"] = groups;
    params["rule-providers"] = ruleProviders;

    return params;
}

function getProxiesByRegex(params, regex) {
    var proxies = params.proxies
        .filter((e) => regex.test(e.name))
        .map((e) => e.name);
    return proxies;
}
