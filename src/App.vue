<script setup lang="ts">
import { onLaunch, onShow, onHide,onLoad} from "@dcloudio/uni-app";

onLaunch(async() => {
  uni.hideTabBar()

  console.log("App Launch");
 

});
onShow(() => {
  uni.hideTabBar()

  console.log("App onShow");
  
});
onLoad(()=>{
  
  console.log("App load");


})
onHide(() => {
  console.log("App Hide");
});

</script>
<style></style>
