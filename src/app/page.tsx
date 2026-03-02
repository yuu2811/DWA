import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 no-print">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-800">
            DWA - Driver Wellness Assessment
          </h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                ドライバー健康診断ツール
              </h2>
              <p className="text-slate-500 text-sm">
                Driver Wellness Assessment
              </p>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">
              本ツールは、産業医・保健師がドライバーの健康状態を多角的にスクリーニングするための問診票です。学術的に妥当性が検証された尺度を用いて、以下の5領域を評価します。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                <span className="text-lg mt-0.5">🌙</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">睡眠</p>
                  <p className="text-xs text-slate-500">
                    ESS（エプワース眠気尺度）
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50">
                <span className="text-lg mt-0.5">🧠</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    ストレス
                  </p>
                  <p className="text-xs text-slate-500">
                    K6（ケスラー心理的苦痛尺度）
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
                <span className="text-lg mt-0.5">🔋</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    疲労
                  </p>
                  <p className="text-xs text-slate-500">
                    疲労蓄積度チェックリスト（厚生労働省）
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                <span className="text-lg mt-0.5">🥗</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    食事・栄養
                  </p>
                  <p className="text-xs text-slate-500">
                    特定健診質問票準拠
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50">
                <span className="text-lg mt-0.5">🏃</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    運動・身体活動
                  </p>
                  <p className="text-xs text-slate-500">
                    IPAQ-SF（国際標準化身体活動質問票）
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">所要時間：</span>約10〜15分
              </p>
              <p className="text-sm text-slate-600 mt-1">
                <span className="font-semibold">対象：</span>
                事業用自動車運転者（トラック・バス・タクシー等）
              </p>
              <p className="text-sm text-slate-600 mt-1">
                <span className="font-semibold">用途：</span>
                産業医面談・保健師面談における健康スクリーニング
              </p>
            </div>

            <Link
              href="/assessment"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-4 rounded-xl transition-colors text-lg"
            >
              診断を開始する
            </Link>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            本ツールは健康スクリーニングを目的としたものであり、医学的診断を行うものではありません。
            <br />
            結果に基づく判断は必ず産業医等の医療専門職が行ってください。
          </p>
        </div>
      </main>
    </div>
  );
}
