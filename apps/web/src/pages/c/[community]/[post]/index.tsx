import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'ui'

export default function Post() {
  const router = useRouter()

  const { community, post } = router.query

  console.log(post)

  return (
    <main>
      <h1 className="text-xl font-medium">Title Here</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, nisl nec ultricies lacinia, nisl nisl
        aliquet nisl, nec tincidunt nisl nisl et nisl. Sed tincidunt, nisl nec ultricies lacinia, nisl nisl aliquet
        nisl, nec tincidunt nisl nisl et nisl.
      </p>

      <div className="mt-6">
        <Button buttonType="slate">
          <Link href="/c/[community]" as={`/c/${community}`}>
            Back to community
          </Link>
        </Button>
      </div>
    </main>
  )
}
