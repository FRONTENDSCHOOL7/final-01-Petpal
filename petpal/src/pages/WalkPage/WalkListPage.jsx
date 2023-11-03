import React, { useEffect, useState } from 'react';
import Header from '../../components/Common/Header/Header';
import WalkItemList from '../../components/Walk/WalkItemList';
import { getWalkList } from '../../api/walk';
import { useRecoilValue } from 'recoil';
import { userInfoAtom } from '../../atoms/AtomUserState';

export default function WalkListPage() {
  const userInfo = useRecoilValue(userInfoAtom);
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWalkList();
      setPostList(data.data.posts);
    };
    fetchData();
    console.log(postList);
  }, []);

  const walkList = postList.filter(
    post =>
      post.author.accountname.includes('petpal_') &&
      post.content.includes('petpal_walk') &&
      post.author.intro === userInfo.intro,
  );
  console.log(walkList);

  return (
    <>
      <Header type="list" title="산책메이트" />
      {walkList && <WalkItemList walkList={walkList} />}
    </>
  );
}
