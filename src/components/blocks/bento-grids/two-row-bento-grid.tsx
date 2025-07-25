export default function TwoRowBentoGrid() {
    return (
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-base/7 font-semibold text-emerald-400">Deploy faster</h2>
          <p className="mt-2 max-w-lg text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
            Everything you need to deploy your app
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
            <div className="flex p-px lg:col-span-4">
              <div className="w-full overflow-hidden rounded-lg bg-gray-800 outline outline-white/15 max-lg:rounded-t-4xl lg:rounded-tl-4xl">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-02-releases.png"
                  className="h-80 object-cover object-left"
                />
                <div className="p-10">
                  <h3 className="text-sm/4 font-semibold text-gray-400">Releases</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-white">Push to deploy</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In gravida justo et nulla efficitur, maximus
                    egestas sem pellentesque.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex p-px lg:col-span-2">
              <div className="w-full overflow-hidden rounded-lg bg-gray-800 outline outline-white/15 lg:rounded-tr-4xl">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-02-integrations.png"
                  className="h-80 object-cover"
                />
                <div className="p-10">
                  <h3 className="text-sm/4 font-semibold text-gray-400">Integrations</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-white">Connect your favorite tools</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400">
                    Curabitur auctor, ex quis auctor venenatis, eros arcu rhoncus massa.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex p-px lg:col-span-2">
              <div className="w-full overflow-hidden rounded-lg bg-gray-800 outline outline-white/15 lg:rounded-bl-4xl">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-02-security.png"
                  className="h-80 object-cover"
                />
                <div className="p-10">
                  <h3 className="text-sm/4 font-semibold text-gray-400">Security</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-white">Advanced access control</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400">
                    Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex p-px lg:col-span-4">
              <div className="w-full overflow-hidden rounded-lg bg-gray-800 outline outline-white/15 max-lg:rounded-b-4xl lg:rounded-br-4xl">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-02-performance.png"
                  className="h-80 object-cover object-left"
                />
                <div className="p-10">
                  <h3 className="text-sm/4 font-semibold text-gray-400">Performance</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-white">Lightning-fast builds</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-400">
                    Sed congue eros non finibus molestie. Vestibulum euismod augue vel commodo vulputate. Maecenas at
                    augue sed elit dictum vulputate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
