import { test, expect } from '@playwright/test';

/**
 * 결제 위젯 렌더링 디버깅 테스트
 */

test.describe('결제 위젯 디버깅', () => {
  test('위젯 렌더링 상태 확인', async ({ page }) => {
    // 콘솔 로그 캡처
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    // 페이지 로드
    await page.goto('/payment/reunion-possibility');

    // 15초 동안 위젯 로드 대기
    await page.waitForTimeout(15000);

    // 콘솔 로그 출력
    console.log('\n=== Console Logs ===');
    consoleLogs.forEach(log => console.log(log));

    // 위젯 컨테이너 확인
    const paymentWidget = await page.$('#payment-widget');
    const agreementWidget = await page.$('#agreement');

    console.log('\n=== DOM State ===');
    console.log('Payment widget container exists:', !!paymentWidget);
    console.log('Agreement widget container exists:', !!agreementWidget);

    // 위젯 내용 확인
    if (paymentWidget) {
      const innerHTML = await paymentWidget.innerHTML();
      console.log('Payment widget innerHTML length:', innerHTML.length);
      console.log('Payment widget has content:', innerHTML.length > 0);
    }

    if (agreementWidget) {
      const innerHTML = await agreementWidget.innerHTML();
      console.log('Agreement widget innerHTML length:', innerHTML.length);
    }

    // isWidgetReady 상태 확인
    const buttonText = await page.$eval('button', (btn) => btn.textContent);
    console.log('Button text:', buttonText);

    // 버튼 disabled 상태
    const isDisabled = await page.$eval('button', (btn) => (btn as HTMLButtonElement).disabled);
    console.log('Button disabled:', isDisabled);

    // 토스 iframe 존재 확인
    const tossIframes = await page.$$('iframe');
    console.log('Number of iframes:', tossIframes.length);

    // 스크린샷 저장
    await page.screenshot({ path: 'test-results/payment-widget-state.png', fullPage: true });

    // 위젯이 로드되었는지 확인
    const hasWidgetContent = await page.evaluate(() => {
      const widget = document.querySelector('#payment-widget');
      return widget ? widget.innerHTML.length > 100 : false;
    });

    console.log('\n=== Final Check ===');
    console.log('Widget has substantial content:', hasWidgetContent);

    // 테스트 결과
    expect(hasWidgetContent).toBe(true);
  });
});
