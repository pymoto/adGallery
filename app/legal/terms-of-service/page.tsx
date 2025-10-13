"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">利用規約</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">第1条（適用）</h3>
                  <p className="text-sm text-muted-foreground">
                    本利用規約（以下「本規約」）は、Adscopia（以下「当サービス」）の利用条件を定めるものです。利用者は、本規約に同意の上、当サービスを利用するものとします。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第2条（利用登録）</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスの利用を希望する者は、本規約に同意の上、当サービスの定める方法によって利用登録を申請し、当サービスがこれを承認することによって、利用登録が完了するものとします。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第3条（ユーザーIDおよびパスワードの管理）</h3>
                  <p className="text-sm text-muted-foreground">
                    利用者は、自己の責任において、当サービスのユーザーIDおよびパスワードを適切に管理するものとします。利用者は、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第4条（禁止事項）</h3>
                  <p className="text-sm text-muted-foreground">
                    利用者は、当サービスの利用にあたり、以下の行為をしてはなりません：
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 space-y-1">
                    <li>法令または公序良俗に違反する行為</li>
                    <li>犯罪行為に関連する行為</li>
                    <li>当サービスの内容等、当サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
                    <li>当サービス、ほかの利用者、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                    <li>当サービスの運営を妨害するおそれのある行為</li>
                    <li>不正アクセスをし、またはこれを試みる行為</li>
                    <li>他の利用者に関する個人情報等を収集または蓄積する行為</li>
                    <li>不正な目的を持って当サービスを利用する行為</li>
                    <li>当サービスの他の利用者またはその他の第三者に不利益、損害、不快感を与える行為</li>
                    <li>その他当サービスが不適切と判断する行為</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第5条（広告投稿について）</h3>
                  <p className="text-sm text-muted-foreground">
                    利用者が投稿する広告については、利用者の責任において行うものとします。当サービスは、投稿された広告の内容について一切の責任を負いません。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第6条（決済について）</h3>
                  <p className="text-sm text-muted-foreground">
                    広告投稿には決済が必要です。決済はStripeを通じて安全に処理されます。決済完了後、広告は管理者による承認を経て公開されます。承認には通常1-3営業日程度かかります。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第7条（返金について）</h3>
                  <p className="text-sm text-muted-foreground">
                    デジタルコンテンツの性質上、原則として返金は行いません。ただし、システムの不具合等によりサービスが提供できない場合は、全額返金いたします。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第8条（当サービスの提供の停止等）</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスは、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします：
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 space-y-1">
                    <li>当サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                    <li>地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合</li>
                    <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                    <li>その他、当サービスが当サービスの提供が困難と判断した場合</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第9条（利用制限および登録抹消）</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスは、利用者が以下のいずれかに該当する場合には、事前の通知なく、利用者に対して、当サービスの全部もしくは一部の利用を制限し、または利用者としての登録を抹消することができるものとします：
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 space-y-1">
                    <li>本規約のいずれかの条項に違反した場合</li>
                    <li>登録事項に虚偽の事実があることが判明した場合</li>
                    <li>決済手段として当サービスが指定するものの提供を受けられない場合</li>
                    <li>料金等の支払債務の不履行があった場合</li>
                    <li>当サービスからの連絡に対し、一定期間返答がない場合</li>
                    <li>当サービスについて、最終の利用から一定期間利用がない場合</li>
                    <li>その他、当サービスが当サービスの利用を適当でないと判断した場合</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第10条（免責事項）</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスは、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第11条（サービス内容の変更等）</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスは、利用者に通知することなく、当サービスの内容を変更しまたは当サービスの提供を中止することができるものとし、これによって利用者に生じた損害について一切の責任を負いません。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第12条（利用規約の変更）</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスは、必要と判断した場合には、利用者に通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、当サービスの利用を開始した場合には、当該利用者は変更後の規約に同意したものとみなします。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第13条（個人情報の取扱い）</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスは、利用者の個人情報については、当サービスのプライバシーポリシーに従って適切に取り扱うものとします。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第14条（通知または連絡）</h3>
                  <p className="text-sm text-muted-foreground">
                    利用者と当サービスとの間の通知または連絡は、当サービスの定める方法によって行うものとします。当サービスは、利用者から、当サービスが別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、利用者に送信された時点で利用者に到達したものとみなします。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第15条（権利義務の譲渡の禁止）</h3>
                  <p className="text-sm text-muted-foreground">
                    利用者は、当サービスの書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">第16条（準拠法・裁判管轄）</h3>
                  <p className="text-sm text-muted-foreground">
                    本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当サービスの本店所在地を管轄する裁判所を専属的合意管轄とします。
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  最終更新日：2024年10月12日
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
