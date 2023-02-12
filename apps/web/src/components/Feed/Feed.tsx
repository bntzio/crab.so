import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

const messages = [
  {
    id: 1,
    subject: 'Velit placeat sit ducimus non sed',
    sender: 'Anatoly Yakovenko',
    upvotes: '26',
    community: 'Solana',
    time: '1d ago',
    datetime: '2023-02-12T16:35',
    preview:
      'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
  },
  {
    id: 2,
    subject: 'Velit placeat sit ducimus non sed',
    sender: 'Raj Gokal',
    upvotes: '38',
    community: 'Solana',
    time: '1d ago',
    datetime: '2023-02-12T15:24',
    preview:
      'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
  },
  {
    id: 3,
    subject: 'Velit placeat sit ducimus non sed',
    sender: 'Austin Federa',
    upvotes: '42',
    community: 'Solana',
    time: '1d ago',
    datetime: '2023-02-12T14:13',
    preview:
      'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
  },
]

export default function Feed() {
  return (
    <ul role="list" className="divide-y divide-gray-200">
      {messages.map(message => (
        <li
          key={message.id}
          className="relative bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-600 hover:bg-gray-50"
        >
          <div className="flex justify-between space-x-3 items-center">
            <div className="mb-1 mr-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <div>
                <span className="sr-only">Upvote</span>
                <ChevronUpIcon className="h-5 w-5 text-orange-400" aria-hidden="true" />
              </div>
              <div className="flex justify-center">
                <span className="text-xs text-gray-500 py-1">{message.upvotes}</span>
              </div>
              <div>
                <span className="sr-only">Downvote</span>
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>

            <div className="min-w-0 flex-1 -mt-1">
              <a href="#" className="block focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="truncate text-sm font-medium text-gray-900">{message.subject}</p>
                <p className="truncate text-sm text-gray-500">
                  {message.sender} on {message.community}
                </p>
              </a>
            </div>

            <time dateTime={message.datetime} className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
              {message.time}
            </time>
          </div>

          <div className="mt-1">
            <p className="text-sm text-gray-600 line-clamp-2">{message.preview}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}