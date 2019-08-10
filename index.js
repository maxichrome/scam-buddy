const host = location.hostname
const path = location.pathname

let disable = false

if (localStorage.getItem('disableRedeem') === undefined)
    localStorage.setItem('disableRedeem', false)

disable = localStorage.getItem('disableRedeem')

const head = document.head || document.getElementsByTagName('head')[0]
const style = document.createElement('style')

head.appendChild(style)
style.type = 'text/css'

function addCustomStyle(newStyle) {
    style.appendChild(document.createTextNode(newStyle))
}

const scripts = {
    'play.google.com': googlePlay,
    'www.target.com': target,
    'www.google.com': googleSearch,
    'google.com': googleSearch
}

for (const scriptHost in scripts) {
    if (host === scriptHost)
        scripts[host]()
}

function googleSearch() {
    if (path.startsWith('/search') && location.search.includes('q=')) {
        // Go to the fifth page of bing
        location.replace(location.href.replace('google.com', 'bing.com') + '&first=53')
    }
}

function googlePlay() {

}

function target() {
    if (disable)
        return

    if (path === '/guest/gift-card-balance') {
        console.log('setting up gift card page...')

        const button = document.getElementById('queryGiftCard')
        const content = document.querySelector('div[data-component="pagetitle"] > div > div:nth-of-type(3)')
        const title = document.querySelector('div[data-component="pagetitle"] > div > div:nth-of-type(2) > h1')

        let balance = 20
        let cardNumber = 1234

        title.innerHTML = 'check and redeem Gift Card balance'
        // button.innerText = 'check balance'

        addCustomStyle(
            `
            .card {
                background: #fff;
                margin: auto;
                border-radius: 1rem;
                display: flex;
                flex-direction: column;
                padding: 15px;
                min-width: 7.5rem;
            }

            .flex {
                display: flex;
            }

            .flex-row {
                display: flex;
                flex-direction: row;
            }

            .flex-col {
                display: flex;
                flex-direction: column;
            }

            picture.card-image img {
                max-height: 5rem;
            }

            .card-info {
                margin-top: 1.25rem;
                margin-left: 1rem;
                line-height: 1rem;
            }

            .card-info h3 {
                font-size: 2.5rem;
                line-height: 2.5rem;
            }

            .mx-auto {
                margin-left: auto;
                margin-right: auto;
            }
            `)

        const generateContent = (content, buttons) => `
            <div class="h-bg-grayLight h-margin-t-wide h-margin-b-default Row-uds8za-0 gnKDVb">
                <div class="h-margin-v-jumbo Col-favj32-0 fkooDP card">
                    <div class="styles__GiftCardBox-so05ob-0 bFCFuV">
                        <div class="h-text-left Grid-sc-1825pi3-0 dUwxNs flex-col">
                            <div class="h-padding-h-default Row-uds8za-0 tcsDr flex-row">
                                <div class="Col-favj32-0 bkaXIn" style="">
                                    <div class="h-padding-t-default h-padding-b-tiny styles__WalletImage-so05ob-3 dOlFet">
                                        <picture class="h-padding-t-default h-padding-b-tiny card-image" style="">
                                            <img alt="" src="https://target.scene7.com/is/image/Target/giftcard?qlt=100&amp;fmt=webp">
                                        </picture>
                                    </div>
                                </div>
                                <div id="193ca0d9-4816-4605-85a5-1d2e08107f8d" class="Col-favj32-0 gkLKxF card-info">
                                    <h3 class="Heading__StyledHeading-sc-6yiixr-0 styles__GiftCardValue-so05ob-1 itRmzv">
                                        $${amount}.00
                                    </h3>
                                    <span class="styles__CardText-so05ob-2 fcgmlh">
                                        ending in ${cardNumber}
                                    </span>
                                </div>
                            </div>
                            <div class="h-text-center" data-test="no-giftcard-history">
                                <div class="styles__GiftCardNoHistoryText-sc-1whzb83-16 bJKpqi">
                                    ` +
            function () {
                let add = ''
                for (const section of content)
                    add += ''
                        + `<div class="styles__GiftCardNoHistoryText-sc-1whzb83-16 bJKpqi">`
                        + section
                        + `</div>`
                return add
            }() + `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ` +
            function () {
                let add = ''
                for (const button of buttons)
                    add += ''
                        + `<div class="Row-uds8za-0 gnKDVb">`
                        + `<div class="h-margin-v-tight mx-auto Col-favj32-0 fkooDP">`
                        + button
                        + '</div>'
                        + '</div>'
                return add
            }()

        button.onclick = function clickButton(event) {
            event.preventDefault()
            event.stopPropagation()

            let number = document.getElementById('giftCardNumber').value
            const access = document.getElementById('accessNumber').value

            cardNumber = number
                .toString()
                .replace(/[^\d]/g, '')

            cardNumber =
                cardNumber.substr(cardNumber.length - 4)

            const entry = access.substr(5, 3)
            const classifier = access[4]
            const classifications = {
                // 0: convert to following digit x100
                '0': (+entry[0] || 1) * 100,
                // 1: convert to following digit x1000
                '1': (+entry[0] || 1) * 1000,
                // all other numbers: amount will be last 3 digits
                default: +entry
            }

            amount =
                classifications[classifier]
                || classifications.default

            console.log('button clicked')
            content.innerHTML = generateContent(
                [
                    `No recent transactions on this card.`
                ],
                [
                    `<button id="saveToAccount" type="button" name="saveToAccount"  class="Button-bwu3xu-0 eJIvTL">`
                    + 'check another card'
                    + `</button>`,

                    `<button id="checkAnotherGiftCard" type="button" name="checkAnotherGiftCard" class="Button-bwu3xu-0 iFUfKr">`
                    + 'redeem card'
                    + `</button>`
                ])

            setTimeout(function () {
                const redeemButton = document.getElementById('saveToAccount')
                const refreshButton = document.getElementById('checkAnotherGiftCard')

                redeemButton.classList.remove('eJIvTL')
                redeemButton.classList.add('bGPuyX')
                redeemButton.innerText = 'redeem card'

                refreshButton.innerText = 'check another card'
                refreshButton.onclick = function (event) { location.reload() }

                redeemButton.onclick = function (event) {
                    event.preventDefault()
                    event.stopPropagation()

                    redeemButton.classList.remove('bGPuyX')
                    redeemButton.classList.add('eJIvTL')

                    setTimeout(function () {
                        content.innerHTML =
                            generateContent(
                                [
                                    `This balance has been redeemed!`,
                                    `Your new account balance is <strong>$${amount}.00</strong>`
                                ],
                                [
                                    `<button id="checkAnotherGiftCard" onclick="location.reload()" type="button" name="saveToAccount" class="Button-bwu3xu-0 bGPuyX">`
                                    + 'check another card'
                                    + `</button>`
                                ])
                    }, 5500 * Math.random())
                }
            }, 1500)

            return false
        }
    }
}
