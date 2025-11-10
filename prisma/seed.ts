import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const mysteries = [
  {
    slug: 'Crime-and-Punishment-In-Bibliotheca',
    title: '죄와 벌의 도서관 (Crime and Punishment In Bibliotheca)',
    synopsis: '밀실에서 살해당한 도서관의 관장. 히무라 도서관을 감싸는 "읽으면 죽는 고서"의 비밀.',
    imagePath: '/mysteries/bibiliotheca.jpg',
    markdownPath: 'content/mysteries/bibiliotheca.md',
  },
  {
    slug: "The-Tale-of-Twilight-Wolves",
    title: "늑대인간 마을의 축제 (The Tale of Twilight Wolves)",
    synopsis: "인적이 드문 숲 속 마을에서 벌어진 살인 사건, 그리고 떠오르는 늑대인간에 대한 전설.",
    imagePath: '/mysteries/wolves.jpg',
    markdownPath: 'content/mysteries/wolves.md',
  },
  {
    slug: "Once-in-a-Blue-Moon",
    title: "몇 번이고 푸른 달에 불을 붙였다 (Once in a Blue Moon)",
    synopsis: "주요 관계자들이 모두 모인 보스의 만찬, 그리고 살해당한 마피아의 보스.",
    imagePath: "/mysteries/bluemoon.jpg",
    markdownPath: 'content/mysteries/bluemoon.md',
  },
  {
    slug: "The-Swallow-in-a-Cage-Dreams",
    title: "새장 속 제비는 꿈을 꾼다 (The Swallow in a Cage Dreams)",
    synopsis: "달리는 기차 속 벌어진 살인 사건, 결코 들켜서는 안되는 각자의 비밀들.",
    imagePath: "/mysteries/swallow.jpg",
    markdownPath: 'content/mysteries/swallow.md',
  },
  {
    slug: "The-Murder-at-Cthulhu-Manor",
    title: "구두룡 제택의 살인 (The Murder at Cthulhu Manor)",
    synopsis: "강령술 의식 이후 벌어진 살인 사건, 저택에 드리우는 검은 그림자.",
    imagePath: "/mysteries/cthulhu.jpg",
    markdownPath: 'content/mysteries/cthulhu.md'
  },
  {
    slug: "The-Storyteller-of-Thermopylae",
    title: "테르모필라이의 협잡꾼 (The Storyteller of Thermopylae)",
    synopsis: "결전의 날 앞, 살해당한 스파르타의 왕. 스파르타의 앞 날은 어떻게 되는것인가.",
    imagePath: "/mysteries/thermopylae.jpg",
    markdownPath: "content/mysteries/thermopylae.md"
  },
  {
    slug: "Wendy-Grow-Up",
    title: "웬디, 어른이 되렴 (Wendy, Grow Up)",
    synopsis: "고립된 실험실, 혼란스러운 피험자들, 그리고 살해당한 안드로이드.",
    imagePath: "/mysteries/wendy.jpg",
    markdownPath: "content/mysteries/wendy.md"
  },
  {
    slug: "The-Endless-Midsummer",
    title: "끝나지 않는 한여름 (The Endless Midsummer)",
    synopsis: "나는 왜 죽었는가, 나는 누가 죽였는가, 나는 왜 죽어야만 하는가.",
    imagePath: "/mysteries/midsummer.jpg",
    markdownPath: "content/mysteries/midsummer.md"
  },
  {
    slug: "The-Brave-is-Dead",
    title: "용사가 죽었다 (The Brave is Dead)",
    synopsis: "의심하는 동료들, 엄습하는 악의 손길, 용사의 죽음 뒤에 숨겨진 진실.",
    imagePath: "/mysteries/brave.jpg",
    markdownPath: "content/mysteries/brave.md"
  },
  {
    slug: "The-Hidden-Story-H",
    title: "숨겨진 이야기 H (The Hidden Story H)",
    synopsis: "인류를 위협하는 바이러스, 그리고 치료제를 개발한 한 천재 의사의 죽음. 그의 죽음에는 어떤 비밀이 있는 것인가.",
    imagePath: "/mysteries/H.jpg",
    markdownPath: "content/mysteries/H.md"
  },
  {
    slug: "Redemption-on-Dark-Yule",
    title: "다크 율에 속죄를 (Redemption on Dark Yule)",
    synopsis: "눈보라가 내리는, 가장 어둡지만 가장 하얀 밤에 발견된 시체. 이 자가 죽은 것은 뱀파이어 파벌간 일어난 참극인가, 아니면 누군가에 의해 계획된 속죄극인가.",
    imagePath: "/mysteries/yule.jpg",
    markdownPath: "content/mysteries/yule.md"
  }
]

async function main() {
  console.log('🌱 Start seeding...')
  
  for (const mystery of mysteries) {
    const result = await prisma.mystery.upsert({
      where: { slug: mystery.slug },
      update: mystery,
      create: mystery
    })
    console.log(`Created/Updated mystery: ${result.title}`)
  }
  
  console.log('🌱 Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })