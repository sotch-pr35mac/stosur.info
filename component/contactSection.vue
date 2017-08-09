<template>
  <div>
    <h1>Contact Me</h1>
    <div class="container">
      <div class="row">
        <div class="four columns">
          <h4>Around Town</h4>
          <p>
            Ann Arbor Michigan, <br>
            United States of America
          </p>
        </div>
        <div class="four columns">
          <h4>Electronically</h4>
          <p>
            +1 (630) 677-2884<br>
            p.wanstobas@gmail.com
          </p>
        </div>
      </div>
      <form action="https://formspree.io/p.wanstobas@gmail.com" method="post">
        <label for="inputName">Your Name</label>
        <input class="u-full-width" type="text" placeholder="Lori Ipsum" id="inputName" name="inputName" />
        <br>
        <br>
        <div class="row">
          <div class="six columns">
            <label for="_replyto">Your email</label>
            <input class="u-full-width" type="email" placeholder="test@mailbox.com" id="inputEmail" name="_replyto">
          </div>
          <div class="six columns">
            <label for="_subject">Reason for contact</label>
            <select class="u-full-width" id="inputSubject" name="_subject">
              <option selected disabled value="hello">Just to say hello</option>
              <option value="question">Question or Concern</option>
              <option value="job">Employment Opportunity</option>
            </select>
          </div>
        </div>
        <br>
        <label for="inputMessage">Message</label>
        <textarea class="u-full-width" placeholder="Hello Preston..." id="inputMessage" name="inputMessage"></textarea>
        <br>
        <br>
        <input class="button-primary" type="submit" value="Send">
      </form>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
</style>
