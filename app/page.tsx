"use client";

import { useEffect, useState } from "react";

// สร้าง Type สำหรับข้อมูลทวีต
interface Tweet {
  id: number;
  name: string;
  msg: string;
  url: string;
  time: string;
}

export default function TwitterApp() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    // ข้อมูลจำลอง (โชว์ตอนเปิดดูบนเว็บปกติ)
    const dummyData: Tweet[] = [
      {
        id: 1,
        name: "Admin WANWEEK",
        msg: "ยินดีต้อนรับสู่ระบบ Twitter รูปแบบใหม่ของเซิร์ฟเวอร์เรา! 🚀",
        url: "",
        time: "1 นาทีที่แล้ว",
      },
      {
        id: 2,
        name: "Natchakorn Thongtem",
        msg: "วันนี้เมืองวิวสวยมากครับ แวะมาถ่ายรูปกันได้เลย 📸",
        url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
        time: "5 นาทีที่แล้ว",
      },
    ];
    setTweets(dummyData);

    // ดักจับข้อมูลจากเกม (SAMP CEF)
    if (typeof window !== "undefined" && (window as any).cef) {
      (window as any).cef.on("AddNewTweet", (name: string, message: string, image: string, time: string) => {
        const newTweet: Tweet = {
          id: Date.now(),
          name: name,
          msg: message,
          url: image,
          time: time,
        };
        // ดันโพสต์ใหม่ขึ้นไปอยู่บนสุด
        setTweets((prev) => [newTweet, ...prev]);
      });
    }
  }, []);

  const handleSendTweet = () => {
    if (!msg && !url) return;

    if (typeof window !== "undefined" && (window as any).cef) {
      // ส่งข้อมูลกลับไปให้ Pawn Script
      (window as any).cef.emit("OnPlayerSendTweet", msg, url);
    } else {
      // ถ้าไม่ได้อยู่ในเกม ให้จำลองการโพสต์บนหน้าเว็บ
      const newTweet: Tweet = { id: Date.now(), name: "Player", msg, url, time: "เมื่อสักครู่" };
      setTweets((prev) => [newTweet, ...prev]);
    }

    setMsg("");
    setUrl("");
    setShowModal(false);
  };

  return (
    // พื้นหลังโปร่งใส (เพื่อให้มองทะลุเห็นฉากในเกม) และจัดให้อยู่ขวาล่าง
    <div className="w-screen h-screen bg-transparent flex justify-end items-center pr-10">
      
      {/* กรอบโทรศัพท์จำลอง */}
      <div className="w-[340px] h-[650px] bg-[#15202B] rounded-[40px] border-[10px] border-[#22303C] shadow-2xl relative flex flex-col overflow-hidden font-sans">
        
        {/* แถบ Header ด้านบน */}
        <div className="flex items-center px-5 py-4 border-b border-gray-800 bg-[#15202B]/90 backdrop-blur-sm z-10">
          <svg className="w-6 h-6 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
          </svg>
          <h1 className="ml-3 font-bold text-white text-lg tracking-wide">Twitter</h1>
        </div>

        {/* พื้นที่แสดงรายการทวีต (ซ่อน Scrollbar แต่เลื่อนได้) */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="flex px-4 py-3 border-b border-gray-800 hover:bg-white/[0.03] transition">
              {/* รูปโปรไฟล์จำลอง (ใช้อักษรตัวแรกของชื่อ) */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1DA1F2] to-blue-800 flex items-center justify-center text-white font-bold shrink-0">
                {tweet.name.charAt(0)}
              </div>

              {/* เนื้อหาทวีต */}
              <div className="ml-3 flex-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-white text-[15px]">{tweet.name}</span>
                  <span className="text-[#8899A6] text-sm truncate">@{tweet.name.replace(/\s+/g, '').toLowerCase()}</span>
                  <span className="text-[#8899A6] text-sm">· {tweet.time}</span>
                </div>
                
                {tweet.msg && <p className="text-white text-[15px] mt-1 whitespace-pre-wrap">{tweet.msg}</p>}

                {/* ถ้ารูปมี URL ให้โชว์ Card รูปภาพขอบมน */}
                {tweet.url && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800">
                    <img src={tweet.url} alt="tweet image" className="w-full object-cover max-h-60" />
                  </div>
                )}

                {/* แถบปุ่ม Action (คอมเมนต์, รีโพสต์, หัวใจ) */}
                <div className="flex justify-between items-center mt-3 text-[#8899A6] max-w-[200px]">
                  <button className="flex items-center gap-1 hover:text-[#1DA1F2] transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </button>
                  <button className="flex items-center gap-1 hover:text-[#17BF63] transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <button className="flex items-center gap-1 hover:text-[#E0245E] transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ปุ่มวงกลมลอยๆ (Floating Action Button) สำหรับสร้างโพสต์ */}
        <button 
          onClick={() => setShowModal(true)}
          className="absolute bottom-6 right-5 w-14 h-14 bg-[#1DA1F2] hover:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-[0_4px_10px_rgba(29,161,242,0.4)] transition transform hover:scale-105 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
        </button>

        {/* Modal Overlay: หน้าต่างสำหรับพิมพ์ทวีต */}
        {showModal && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-[#15202B] w-full max-w-[300px] rounded-2xl p-4 shadow-2xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-gray-800 p-1 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <button 
                  onClick={handleSendTweet}
                  disabled={!msg && !url}
                  className="bg-[#1DA1F2] disabled:opacity-50 text-white font-bold py-1.5 px-4 rounded-full text-sm hover:bg-blue-500 transition"
                >
                  โพสต์
                </button>
              </div>
              
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1DA1F2] to-blue-800 shrink-0"></div>
                <div className="flex-1">
                  <textarea
                    autoFocus
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="คุณกำลังคิดอะไรอยู่?"
                    className="w-full bg-transparent text-white text-lg placeholder-gray-500 outline-none resize-none overflow-hidden min-h-[80px]"
                  />
                  <div className="border-t border-gray-700 pt-3 mt-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="วางลิงก์รูปภาพ (Imgur) ที่นี่"
                      className="w-full bg-[#22303C] text-[#1DA1F2] text-sm px-3 py-2 rounded-lg outline-none placeholder-gray-500 border border-transparent focus:border-[#1DA1F2] transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}