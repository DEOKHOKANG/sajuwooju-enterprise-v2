import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('Card 컴포넌트 렌더링', () => {
      render(<Card>카드 컨텐츠</Card>);
      expect(screen.getByText('카드 컨텐츠')).toBeInTheDocument();
    });

    it('커스텀 className 적용', () => {
      const { container } = render(
        <Card className="custom-card">내용</Card>
      );
      const card = container.firstChild;
      expect(card).toHaveClass('custom-card');
    });

    it('자식 요소 렌더링', () => {
      render(
        <Card>
          <div data-testid="child">자식 요소</div>
        </Card>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('CardHeader', () => {
    it('CardHeader 렌더링', () => {
      render(<CardHeader>헤더</CardHeader>);
      expect(screen.getByText('헤더')).toBeInTheDocument();
    });

    it('CardTitle과 함께 사용', () => {
      render(
        <CardHeader>
          <CardTitle>제목</CardTitle>
        </CardHeader>
      );
      expect(screen.getByText('제목')).toBeInTheDocument();
    });
  });

  describe('CardTitle', () => {
    it('CardTitle 렌더링', () => {
      render(<CardTitle>카드 제목</CardTitle>);
      expect(screen.getByText('카드 제목')).toBeInTheDocument();
    });

    it('heading 태그로 렌더링', () => {
      const { container } = render(<CardTitle>제목</CardTitle>);
      const heading = container.querySelector('h3');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('제목');
    });
  });

  describe('CardDescription', () => {
    it('CardDescription 렌더링', () => {
      render(<CardDescription>설명 텍스트</CardDescription>);
      expect(screen.getByText('설명 텍스트')).toBeInTheDocument();
    });

    it('paragraph 태그로 렌더링', () => {
      const { container } = render(<CardDescription>설명</CardDescription>);
      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe('CardContent', () => {
    it('CardContent 렌더링', () => {
      render(<CardContent>본문 내용</CardContent>);
      expect(screen.getByText('본문 내용')).toBeInTheDocument();
    });

    it('복잡한 컨텐츠 렌더링', () => {
      render(
        <CardContent>
          <p>첫 번째 단락</p>
          <p>두 번째 단락</p>
        </CardContent>
      );
      expect(screen.getByText('첫 번째 단락')).toBeInTheDocument();
      expect(screen.getByText('두 번째 단락')).toBeInTheDocument();
    });
  });

  describe('CardFooter', () => {
    it('CardFooter 렌더링', () => {
      render(<CardFooter>푸터</CardFooter>);
      expect(screen.getByText('푸터')).toBeInTheDocument();
    });

    it('버튼과 함께 사용', () => {
      render(
        <CardFooter>
          <button>확인</button>
          <button>취소</button>
        </CardFooter>
      );
      expect(screen.getByText('확인')).toBeInTheDocument();
      expect(screen.getByText('취소')).toBeInTheDocument();
    });
  });

  describe('Full Card Structure', () => {
    it('전체 카드 구조 렌더링', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>제품 이름</CardTitle>
            <CardDescription>제품 설명입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <p>상세 정보가 여기에 표시됩니다.</p>
          </CardContent>
          <CardFooter>
            <button>구매하기</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('제품 이름')).toBeInTheDocument();
      expect(screen.getByText('제품 설명입니다')).toBeInTheDocument();
      expect(
        screen.getByText('상세 정보가 여기에 표시됩니다.')
      ).toBeInTheDocument();
      expect(screen.getByText('구매하기')).toBeInTheDocument();
    });

    it('카테고리 카드 렌더링 예시', () => {
      render(
        <Card className="category-card">
          <CardHeader>
            <CardTitle>연애운</CardTitle>
            <CardDescription>사랑과 인연에 관한 운세</CardDescription>
          </CardHeader>
          <CardContent>
            <div data-testid="icon">💖</div>
            <p>올해의 연애운을 확인해보세요</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('연애운')).toBeInTheDocument();
      expect(screen.getByText('사랑과 인연에 관한 운세')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toHaveTextContent('💖');
    });

    it('제품 카드 렌더링 예시', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>프리미엄 사주 분석</CardTitle>
            <CardDescription>AI 기반 상세 분석</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="price">₩30,000</div>
            <div className="features">
              <ul>
                <li>AI 분석</li>
                <li>상세 리포트</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <button>자세히 보기</button>
            <button>구매하기</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('프리미엄 사주 분석')).toBeInTheDocument();
      expect(screen.getByText('₩30,000')).toBeInTheDocument();
      expect(screen.getByText('AI 분석')).toBeInTheDocument();
      expect(screen.getByText('자세히 보기')).toBeInTheDocument();
    });
  });
});
